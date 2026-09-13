type ServerlessResponse = {
  statusCode: number;
  setHeader(name: string, value: string): void;
  end(body?: string): void;
};

type ServerlessApp = (request: unknown, response: unknown) => unknown;

let appPromise: Promise<ServerlessApp> | undefined;

function loadApp() {
  appPromise ??= import("../artifacts/api-server/src/app.js").then(
    ({ default: app }) => app as unknown as ServerlessApp,
  );
  return appPromise;
}

export default async function handler(
  request: unknown,
  response: ServerlessResponse,
) {
  try {
    const app = await loadApp();
    return app(request, response);
  } catch (error) {
    console.error("API initialization failed", error);
    response.statusCode = 500;
    response.setHeader("Content-Type", "application/json");
    return response.end(JSON.stringify({ error: "API_INIT_FAILED" }));
  }
}