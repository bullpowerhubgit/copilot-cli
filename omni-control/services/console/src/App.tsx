import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { io, Socket } from "socket.io-client";

import "./styles.css";

type AgentInfo = {
  agentId: string;
  metrics?: Record<string, unknown>;
};

type CommandResult = {
  ok: boolean;
  data?: unknown;
  error?: string;
};

const env = import.meta.env as Record<string, string | undefined>;
const gatewayUrl = env.VITE_GATEWAY_URL ?? "https://localhost:9443";

const App = () => {
  const [token, setToken] = useState<string>("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const [agents, setAgents] = useState<Map<string, AgentInfo>>(new Map());
  const [log, setLog] = useState<string[]>([]);
  const [command, setCommand] = useState<string>("Get Metrics");
  const [selectedAgent, setSelectedAgent] = useState<string>("");
  const [result, setResult] = useState<CommandResult | null>(null);

  const appendLog = (entry: string) => setLog((prev: string[]) => [new Date().toLocaleTimeString() + " " + entry, ...prev].slice(0, 200));

  useEffect(() => {
    if (!token) {
      socket?.disconnect();
      setSocket(null);
      return;
    }

    const nextSocket = io(gatewayUrl, {
      transports: ["websocket"],
      auth: { token },
    });

    nextSocket.on("connect", () => appendLog("Verbunden mit Control Hub"));
    nextSocket.on("disconnect", () => appendLog("Verbindung getrennt"));
    nextSocket.on("agent:metrics", (payload: AgentInfo) => {
      setAgents((prev: Map<string, AgentInfo>) => {
        const cloned = new Map(prev);
        cloned.set(payload.agentId, payload);
        return cloned;
      });
    });
    nextSocket.on("session:error", (payload: { message: string }) => appendLog(`Session Fehler: ${payload.message}`));

    setSocket(nextSocket);

    return () => {
      nextSocket.disconnect();
    };
  }, [token]);

  const agentList = useMemo<AgentInfo[]>(() => Array.from(agents.values()), [agents]);

  const handleSendCommand = () => {
    if (!socket || !selectedAgent) {
      appendLog("Bitte Agent auswählen und verbinden");
      return;
    }

    const payload = command === "Get Metrics" ? { type: "metrics" } : { type: "shell", command };

    socket.emit("session:start", { agentId: selectedAgent });

    fetch(`${gatewayUrl}/agents/${selectedAgent}/commands`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        setResult(data.response ?? null);
      })
      .catch((error) => {
        appendLog(`Command Fehler: ${error}`);
      });
  };

  return (
    <div className="app">
      <header>
        <h1>Omni Control Console</h1>
      </header>
      <section className="auth">
        <input
          type="password"
          placeholder="JWT Token"
          value={token}
          onChange={(event: ChangeEvent<HTMLInputElement>) => setToken(event.target.value)}
        />
      </section>
      <main>
        <aside>
          <h2>Agents</h2>
          <ul>
            {agentList.map((agent: AgentInfo) => (
              <li key={agent.agentId} onClick={() => setSelectedAgent(agent.agentId)} className={selectedAgent === agent.agentId ? "active" : ""}>
                <strong>{agent.agentId}</strong>
                <small>{JSON.stringify(agent.metrics?.cpu)}</small>
              </li>
            ))}
          </ul>
        </aside>
        <section className="workspace">
          <div className="command">
            <textarea value={command} onChange={(event) => setCommand(event.target.value)} />
            <button onClick={handleSendCommand}>Command senden</button>
          </div>
          <div className="result">
            <h3>Resultat</h3>
            <pre>{JSON.stringify(result, null, 2)}</pre>
          </div>
        </section>
        <section className="log">
          <h2>Log</h2>
          <ul>
            {log.map((entry) => (
              <li key={entry}>{entry}</li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
};

export default App;
