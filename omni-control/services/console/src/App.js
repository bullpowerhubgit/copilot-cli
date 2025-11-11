import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import "./styles.css";
const env = import.meta.env;
const gatewayUrl = env.VITE_GATEWAY_URL ?? "https://localhost:9443";
const App = () => {
    const [token, setToken] = useState("");
    const [socket, setSocket] = useState(null);
    const [agents, setAgents] = useState(new Map());
    const [log, setLog] = useState([]);
    const [command, setCommand] = useState("Get Metrics");
    const [selectedAgent, setSelectedAgent] = useState("");
    const [result, setResult] = useState(null);
    const appendLog = (entry) => setLog((prev) => [new Date().toLocaleTimeString() + " " + entry, ...prev].slice(0, 200));
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
        nextSocket.on("agent:metrics", (payload) => {
            setAgents((prev) => {
                const cloned = new Map(prev);
                cloned.set(payload.agentId, payload);
                return cloned;
            });
        });
        nextSocket.on("session:error", (payload) => appendLog(`Session Fehler: ${payload.message}`));
        setSocket(nextSocket);
        return () => {
            nextSocket.disconnect();
        };
    }, [token]);
    const agentList = useMemo(() => Array.from(agents.values()), [agents]);
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
    return (_jsxs("div", { className: "app", children: [_jsx("header", { children: _jsx("h1", { children: "Omni Control Console" }) }), _jsx("section", { className: "auth", children: _jsx("input", { type: "password", placeholder: "JWT Token", value: token, onChange: (event) => setToken(event.target.value) }) }), _jsxs("main", { children: [_jsxs("aside", { children: [_jsx("h2", { children: "Agents" }), _jsx("ul", { children: agentList.map((agent) => (_jsxs("li", { onClick: () => setSelectedAgent(agent.agentId), className: selectedAgent === agent.agentId ? "active" : "", children: [_jsx("strong", { children: agent.agentId }), _jsx("small", { children: JSON.stringify(agent.metrics?.cpu) })] }, agent.agentId))) })] }), _jsxs("section", { className: "workspace", children: [_jsxs("div", { className: "command", children: [_jsx("textarea", { value: command, onChange: (event) => setCommand(event.target.value) }), _jsx("button", { onClick: handleSendCommand, children: "Command senden" })] }), _jsxs("div", { className: "result", children: [_jsx("h3", { children: "Resultat" }), _jsx("pre", { children: JSON.stringify(result, null, 2) })] })] }), _jsxs("section", { className: "log", children: [_jsx("h2", { children: "Log" }), _jsx("ul", { children: log.map((entry) => (_jsx("li", { children: entry }, entry))) })] })] })] }));
};
export default App;
