export async function apiFetch(url, options = {}) {
  const stored = localStorage.getItem("insurai_auth");
  let token = null;
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      token = parsed.token;
    } catch {
      token = stored; // fallback if some old value
    }
  }

  const headers = {
    ...(options.headers || {}),
  };

  if (options.body && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const resp = await fetch(url, { ...options, headers });
  const text = await resp.text();
  const contentType = resp.headers.get("content-type") || "";

  if (!resp.ok) {
    console.error("apiFetch error", resp.status, text);
    throw new Error(text || `Request failed with status ${resp.status}`);
  }

  if (contentType.includes("application/json") && text) {
    return JSON.parse(text);
  }

  return null;
}




