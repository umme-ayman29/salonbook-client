import { authClient } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

export async function apiFetch(path: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers);

  const { data } = await authClient.token();
  if (data?.token) {
    headers.set("Authorization", `Bearer ${data.token}`);
  }

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  const body = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(body?.message || "Request failed");
  }
  return body;
}

export async function publicFetch(path: string) {
  const res = await fetch(`${API_URL}${path}`, { cache: "no-store" });
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(body?.message || "Request failed");
  }
  return body;
}