import { buildLogger, loadConfig } from "@omni/shared";

const logger = buildLogger("amt-adapter");

const config = loadConfig();

export const connectAmt = async () => {
  logger.info("Intel AMT-Adapter Placeholder aktiv", { controlHub: config.CONTROLHUB_URL });
};

void connectAmt();
