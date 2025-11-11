import axios from "axios";

export class N8nClient {
  constructor(private readonly baseUrl: string, private readonly apiKey?: string) {}

  async triggerWorkflow(workflowId: string, payload: Record<string, unknown>) {
    const url = `${this.baseUrl}/webhook/${workflowId}`;
    const headers = this.apiKey ? { "X-N8N-API-KEY": this.apiKey } : undefined;
    await axios.post(url, payload, { headers });
  }
}
