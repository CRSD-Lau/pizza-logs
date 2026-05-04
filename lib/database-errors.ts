export function isDatabaseConnectionError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  const code = typeof error === "object" && error !== null && "code" in error
    ? String((error as { code?: unknown }).code)
    : "";

  return (
    code === "P1001" ||
    message.includes("Can't reach database server") ||
    message.includes("ECONNREFUSED") ||
    message.includes("Timed out fetching a new connection")
  );
}
