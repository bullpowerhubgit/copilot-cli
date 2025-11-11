import axios from "axios";

export class BrowserlessClient {
  constructor(private readonly baseUrl: string, private readonly token?: string) {}

  async runPdf(url: string) {
    const endpoint = `${this.baseUrl}/pdf`;
    const headers = this.token ? { Authorization: `Bearer ${this.token}` } : undefined;
    const response = await axios.post(endpoint, { url }, { headers, responseType: "arraybuffer" });
    return response.data as ArrayBuffer;
  }

  async runScript(code: string, context?: Record<string, unknown>) {
    const endpoint = `${this.baseUrl}/function`;
    const headers = this.token ? { Authorization: `Bearer ${this.token}` } : undefined;
    const response = await axios.post(endpoint, { code, context }, { headers });
    return response.data;
  }
}
