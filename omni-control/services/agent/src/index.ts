import { io, Socket } from "socket.io-client";
import clipboard from "clipboardy";
import screenshot from "screenshot-desktop";
import si from "systeminformation";
const { machineIdSync } = require("node-machine-id");
import { exec } from "child_process";
import { promisify } from "util";
import robot from "robotjs";

import { buildLogger, loadConfig, signToken } from "@omni/shared";

const execAsync = promisify(exec);

const config = loadConfig("../../../../.env");
const logger = buildLogger("agent");

const agentId = config.AGENT_ID ?? machineIdSync({ original: true });
const authToken = config.AGENT_TOKEN ?? signToken({ sub: agentId, aud: "agent" }, config.JWT_SECRET, "6h");

const socket: Socket = io(config.CONTROLHUB_URL, {
  auth: { token: authToken },
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelayMax: 10000,
});

socket.on("connect", () => {
  logger.info("Agent mit Control Hub verbunden", { agentId, socketId: socket.id });
  socket.emit("agent:hello", { agentId, platform: process.platform, hostname: process.env.COMPUTERNAME });
});

socket.on("disconnect", (reason: any) => {
  logger.warn("Verbindung getrennt", { reason });
});

socket.on("command", async ({ commandId, payload }: { commandId: string; payload: Record<string, unknown> }) => {
  try {
    logger.info("Empfange Command", { commandId, type: payload.type });
    const result = await handleCommand(payload);
    socket.emit("command:result", { commandId, result: { ok: true, data: result } });
  } catch (error) {
    logger.error("Command fehlgeschlagen", { commandId, error: (error as Error).message });
    socket.emit("command:result", { commandId, result: { ok: false, error: (error as Error).message } });
  }
});

socket.on("session:init", async ({ sessionId }: { sessionId: string }) => {
  logger.info("Session init", { sessionId });
  const metrics = await collectMetrics();
  socket.emit("session:meta", { sessionId, agentId, metrics });
});

const handleCommand = async (payload: Record<string, unknown>) => {
  switch (payload.type) {
    case "shell": {
      const command = String(payload.command ?? "");
      if (!command) {
        throw new Error("Ungültiger Shell-Befehl");
      }
      const { stdout, stderr } = await execAsync(command, { shell: "powershell.exe" });
      return { stdout, stderr };
    }
    case "clipboard:get": {
      const text = await clipboard.read();
      return { text };
    }
    case "clipboard:set": {
      await clipboard.write(String(payload.text ?? ""));
      return { ok: true };
    }
    case "screenshot": {
      const image = await screenshot({ format: "jpg" });
      return { image: image.toString("base64"), format: "jpg" };
    }
    case "input:keyboard": {
      const sequence = String(payload.sequence ?? "");
      sequence.split("").forEach((char) => robot.typeString(char));
      return { ok: true };
    }
    case "input:mouse": {
      const x = Number(payload.x ?? 0);
      const y = Number(payload.y ?? 0);
      robot.moveMouse(Math.floor(x), Math.floor(y));
      if (payload.click) {
        robot.mouseClick(String(payload.click));
      }
      return { ok: true };
    }
    case "metrics": {
      const metrics = await collectMetrics();
      return metrics;
    }
    default:
      throw new Error(`Unbekannter Command-Typ: ${payload.type}`);
  }
};

const collectMetrics = async () => {
  const [system, cpu, mem, osInfo, processes] = await Promise.all([
    si.system(),
    si.currentLoad(),
    si.mem(),
    si.osInfo(),
    si.processes()
  ]);

  return {
    agentId,
    system,
    cpu,
    mem: {
      total: mem.total,
      free: mem.free,
      used: mem.used,
      active: mem.active,
    },
    os: osInfo,
    topProcesses: processes.list.slice(0, 5),
  };
};

setInterval(async () => {
  if (!socket.connected) {
    return;
  }
  const metrics = await collectMetrics();
  socket.emit("agent:metrics", metrics);
}, 30000);
