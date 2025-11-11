import axios from "axios";
import { Buffer } from "buffer";
import process from "process";

import { buildLogger, loadConfig } from "@omni/shared";

import { N8nClient } from "./clients/n8n.js";
import { BrowserlessClient } from "./clients/browserless.js";
import { McpControlClient } from "./clients/mcpcontrol.js";

const config = loadConfig();
const logger = buildLogger("automations");

const n8n = config.N8N_BASE_URL ? new N8nClient(config.N8N_BASE_URL, process.env.N8N_API_KEY) : null;
const browserless = config.BROWSERLESS_URL ? new BrowserlessClient(config.BROWSERLESS_URL, process.env.BROWSERLESS_TOKEN) : null;
const mcp = config.MCPCONTROL_URL ? new McpControlClient(config.MCPCONTROL_URL, process.env.MCPCONTROL_TOKEN) : null;

const GATEWAY_URL = `${config.CONTROLHUB_URL.replace(/\/$/, "")}`;

export type AutomationTask = {
  id: string;
  agentId: string;
  action: "browser" | "workflow" | "prompt" | "command";
  payload: Record<string, unknown>;
};

export class AutomationRouter {
  async processTask(task: AutomationTask) {
    logger.info("Starte Automations-Task", { id: task.id, action: task.action });

    switch (task.action) {
      case "workflow":
        await this.runN8nWorkflow(task);
        break;
      case "browser":
        await this.runBrowserless(task);
        break;
      case "prompt":
        await this.runMcpAgent(task);
        break;
      case "command":
        await this.forwardCommand(task);
        break;
      default:
        throw new Error(`Unbekannte Aktion ${task.action}`);
    }
  }

  private async runN8nWorkflow(task: AutomationTask) {
    if (!n8n) {
      throw new Error("n8n ist nicht konfiguriert");
    }
    await n8n.triggerWorkflow(String(task.payload.workflowId), task.payload);
  }

  private async runBrowserless(task: AutomationTask) {
    if (!browserless) {
      throw new Error("Browserless ist nicht konfiguriert");
    }
    if (task.payload.url) {
      const pdf = await browserless.runPdf(String(task.payload.url));
      await this.forwardCommand({
        ...task,
        action: "command",
        payload: {
          type: "file:push",
          fileName: `${task.id}.pdf`,
          data: Buffer.from(pdf).toString("base64"),
        },
      });
    } else if (task.payload.code) {
      await browserless.runScript(String(task.payload.code), task.payload.context as Record<string, unknown>);
    }
  }

  private async runMcpAgent(task: AutomationTask) {
    if (!mcp) {
      throw new Error("MCPControl ist nicht konfiguriert");
    }
    const response = await mcp.invokeAgent(String(task.payload.agent ?? "default"), String(task.payload.prompt ?? ""), task.payload.context as Record<string, unknown>);
    await this.forwardCommand({
      ...task,
      action: "command",
      payload: {
        type: "clipboard:set",
        text: response.output,
      },
    });
  }

  private async forwardCommand(task: AutomationTask) {
    const token = process.env.OPERATOR_TOKEN;
    if (!token) {
      throw new Error("OPERATOR_TOKEN nicht gesetzt");
    }

    const url = `${GATEWAY_URL}/agents/${task.agentId}/commands`;
    await axios.post(url, task.payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}

const router = new AutomationRouter();

const runBootstrap = async () => {
  logger.info("Automations-Service gestartet");

  const demoTask: AutomationTask = {
    id: `task-${Date.now()}`,
    agentId: process.env.DEMO_AGENT_ID ?? "demo-agent",
    action: "command",
    payload: { type: "metrics" },
  };

  try {
    await router.processTask(demoTask);
  } catch (error) {
    logger.warn("Demo Task fehlgeschlagen", { error: (error as Error).message });
  }
};

void runBootstrap();
