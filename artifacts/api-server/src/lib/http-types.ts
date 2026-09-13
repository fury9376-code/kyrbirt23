import type { Logger } from "pino";

export type ApiRequest = {
  body: any;
  params: Record<string, string | undefined>;
  headers: Record<string, string | string[] | undefined>;
  log: Logger;
};

export type ApiResponse = {
  status(code: number): ApiResponse;
  json(body: unknown): ApiResponse;
};