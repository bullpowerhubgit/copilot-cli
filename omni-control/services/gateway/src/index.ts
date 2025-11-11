import http from "http";
import path from "path";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import createError from "http-errors";
import { Server as SocketIOServer, Socket } from "socket.io";
import { v4 as uuid } from "uuid";

import { buildLogger, loadConfig, signToken, verifyToken } from "@omni/shared";

const config = loadConfig("c:\\temp\\omni-control\\.env");
const logger = buildLogger("gateway");

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: config.CONTROLHUB_URL,
    credentials: true,
  },
});

/**
 * In-Memory Demo Stores
 */
const agents = new Map<string, Socket>();
const operators = new Map<string, Socket>();
type PendingResolver = (payload: unknown) => void;

const pendingCommands = new Map<string, PendingResolver>();

const USER_SEED = [
  {
    id: "op-root",
    email: "admin@omni-control.local",
    password: "$2a$10$ThxCe90DyQvQC5Mzr6oRRO/79LsLeOIgzD6EhrFmuEzxWULJ3f1pO", // "OmniAdmin!2025"
    roles: ["operator", "admin"],
  },
];

/**
 * REST: Auth Token Endpoint
 */
app.post("/auth/token", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    const user = USER_SEED.find((u) => u.email === email);
    if (!user) {
      throw createError(401, "Invalid credentials");
    }

    const token = signToken({
      sub: user.id,
      aud: "operator",
      roles: user.roles,
    }, config.JWT_SECRET, "1h");

    res.json({ token });
  } catch (error) {
    next(error);
  }
});

/**
 * REST: Trigger Command (e.g. aus n8n)
 */
app.post("/agents/:agentId/commands", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      throw createError(401, "Token fehlt");
    }

    const token = authHeader.replace("Bearer ", "");
    verifyToken(token, config.JWT_SECRET);

    const agentId = req.params.agentId;
    const socket = agents.get(agentId);
    if (!socket) {
      throw createError(404, "Agent nicht verbunden");
    }

    const commandId = uuid();
    const payload = req.body;

    const responsePromise = new Promise((resolve) => {
      pendingCommands.set(commandId, resolve);
    });

    socket.emit("command", { commandId, payload });

    const response = await Promise.race([
      responsePromise,
      new Promise((_, reject) => setTimeout(() => reject(createError(504, "Agent Timeout")), 15000)),
    ]);

    res.json({ commandId, response });
  } catch (error) {
    next(error);
  }
});

/**
 * Health Endpoint
 */
app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", agents: agents.size, operators: operators.size });
});

/**
 * Socket Authentication Helper
 */
const authenticateSocket = (socket: Socket) => {
  const token = socket.handshake.auth?.token;
  if (!token) {
    throw new Error("Token erforderlich");
  }

  const payload = verifyToken(token, config.JWT_SECRET);
  return payload;
};

io.on("connection", (socket: Socket) => {
  try {
    const payload = authenticateSocket(socket);
    const role = payload.aud;

    if (role === "agent") {
      const agentId = String(payload.sub);
      agents.set(agentId, socket);
      logger.info("Agent verbunden", { agentId });

      socket.on("command:result", ({ commandId, result }: { commandId: string; result: unknown }) => {
        const resolver = pendingCommands.get(commandId);
        if (resolver) {
          resolver(result);
          pendingCommands.delete(commandId);
        }
      });

      socket.on("disconnect", () => {
        agents.delete(agentId);
        logger.warn("Agent getrennt", { agentId });
      });
    } else if (role === "operator") {
      const operatorId = String(payload.sub);
      operators.set(operatorId, socket);
      logger.info("Operator verbunden", { operatorId });

      socket.on("session:start", ({ agentId }: { agentId: string }) => {
        const agentSocket = agents.get(agentId);
        if (!agentSocket) {
          socket.emit("session:error", { message: "Agent offline" });
          return;
        }

        const sessionId = uuid();
        socket.emit("session:ready", { sessionId });
        agentSocket.emit("session:init", { sessionId, operatorId });
      });

      socket.on("disconnect", () => {
        operators.delete(operatorId);
        logger.warn("Operator getrennt", { operatorId });
      });
    }
  } catch (error) {
    logger.error("Socket Auth fehlgeschlagen", { error: (error as Error).message });
    socket.disconnect(true);
  }
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 9443;

server.listen(PORT, () => {
  logger.info("Gateway läuft", {
    port: PORT,
    env: config.NODE_ENV,
    serviceRoot: path.resolve(process.cwd()),
  });
});
