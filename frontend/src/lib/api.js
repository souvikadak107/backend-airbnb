const BASE = import.meta.env.VITE_API_BASE_URL;

export async function api(path, { method = "GET", body, headers: extraHeaders } = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(extraHeaders || {}),
  };

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    credentials: "include", // send/receive HttpOnly cookies
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg = data?.error || data?.message || "Request failed";
    const err  = new Error(msg);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}