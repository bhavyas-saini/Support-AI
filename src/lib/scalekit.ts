import { Scalekit } from '@scalekit-sdk/node';

let scalekit: Scalekit | null = null;

function requireEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function getScalekit() {
  if (!scalekit) {
    scalekit = new Scalekit(
      requireEnv("SCALEKIT_ENVIRONMENT_URL"),
      requireEnv("SCALEKIT_CLIENT_ID"),
      requireEnv("SCALEKIT_CLIENT_SECRET")
    );
  }

  return scalekit;
}
