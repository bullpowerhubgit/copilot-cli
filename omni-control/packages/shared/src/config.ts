import dotenv from "dotenv";
import Joi from "joi";

export interface AppConfig {
  NODE_ENV: "development" | "production" | "test";
  LOG_LEVEL: "error" | "warn" | "info" | "http" | "verbose" | "debug" | "silly";
  JWT_SECRET: string;
  TLS_CERT_PATH?: string;
  TLS_KEY_PATH?: string;
  CONTROLHUB_URL: string;
  N8N_BASE_URL?: string;
  BROWSERLESS_URL?: string;
  MCPCONTROL_URL?: string;
  AGENT_ID?: string;
  AGENT_TOKEN?: string;
  OPERATOR_TOKEN?: string;
  N8N_API_KEY?: string;
  BROWSLESS_TOKEN?: string;
  MCPCONTROL_TOKEN?: string;
  GATEWAY_PORT?: number;
  CONSOLE_PORT?: number;
}

const CONFIG_SCHEMA = Joi.object<AppConfig>({
  NODE_ENV: Joi.string().valid("development", "production", "test").default("development"),
  LOG_LEVEL: Joi.string().valid("error", "warn", "info", "http", "verbose", "debug", "silly").default("info"),
  JWT_SECRET: Joi.string().min(32).required(),
  TLS_CERT_PATH: Joi.string().optional(),
  TLS_KEY_PATH: Joi.string().optional(),
  CONTROLHUB_URL: Joi.string().uri().required(),
  N8N_BASE_URL: Joi.string().uri().optional(),
  BROWSERLESS_URL: Joi.string().uri().optional(),
  MCPCONTROL_URL: Joi.string().uri().optional(),
  AGENT_ID: Joi.string().optional(),
  AGENT_TOKEN: Joi.string().optional(),
  OPERATOR_TOKEN: Joi.string().optional(),
  N8N_API_KEY: Joi.string().allow('').optional(),
  BROWSLESS_TOKEN: Joi.string().allow('').optional(),
  MCPCONTROL_TOKEN: Joi.string().allow('').optional(),
  GATEWAY_PORT: Joi.number().integer().min(1024).max(65535).default(9443),
  CONSOLE_PORT: Joi.number().integer().min(1024).max(65535).default(4173),
})
  .prefs({ stripUnknown: true })
  .unknown(true);

let cachedConfig: AppConfig | null = null;

export const loadConfig = (path?: string): AppConfig => {
  if (cachedConfig) {
    return cachedConfig;
  }

  // Try to load .env from current directory, then parent directory
  let envPath = path;
  if (!envPath) {
    const fs = require('fs');
    const path = require('path');

    // Check current directory first
    if (fs.existsSync('.env')) {
      envPath = '.env';
    }
    // Check parent directory
    else if (fs.existsSync('../.env')) {
      envPath = '../.env';
    }
  }

  dotenv.config(envPath ? { path: envPath } : undefined);
  const { value, error } = CONFIG_SCHEMA.validate(process.env);

  if (error) {
    throw new Error(`Konfigurationsfehler: ${error.message}`);
  }

  cachedConfig = value as AppConfig;
  return cachedConfig;
};
