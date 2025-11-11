import axios from "axios";

export class McpControlClient {
  constructor(private readonly baseUrl: string, private readonly apiKey?: string) {}

  async invokeAgent(agentId: string, prompt: string, context?: Record<string, unknown>) {
    const headers = this.apiKey ? { Authorization: `Bearer ${this.apiKey}` } : undefined;
    const response = await axios.post(`${this.baseUrl}/agents/${agentId}/invoke`, { prompt, context }, { headers });
    return response.data;
  }
}
