import winston from "winston";

const { combine, timestamp, printf, colorize } = winston.format;

export const buildLogger = (serviceName: string) => {
  const formatter = printf((info: winston.Logform.TransformableInfo) => {
    const { level, message, timestamp: time, ...meta } = info;
    const metaString = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
    return `${time} [${serviceName}] ${level}: ${message}${metaString}`;
  });

  return winston.createLogger({
    level: process.env.LOG_LEVEL ?? "info",
    format: combine(timestamp(), colorize(), formatter),
    transports: [new winston.transports.Console()],
  });
};
