import { loadEnv } from "vite";

/** Lee variables del .env en handlers de servidor (TanStack Start / Vite SSR). */
export function readServerEnv(name: string): string | undefined {
  const direct = process.env[name];
  if (direct) return direct;

  const mode = process.env.NODE_ENV ?? "development";
  const loaded = loadEnv(mode, process.cwd(), "");
  return loaded[name];
}
