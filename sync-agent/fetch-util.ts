/**
 * fetch wrapper that aborts after `ms` milliseconds.
 * Use this for all Railway-facing calls so the bridge never hangs on a slow response.
 */
export function fetchWithTimeout(
  url: string,
  opts: RequestInit = {},
  ms = 15_000
): Promise<Response> {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), ms);
  return fetch(url, { ...opts, signal: controller.signal }).finally(() =>
    clearTimeout(t)
  );
}
