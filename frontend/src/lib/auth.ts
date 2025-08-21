import { useStore } from "@/store";

export const getAccessToken = () => {
  try {
    return useStore.getState().auth.token;
  } catch {
    return null;
  }
};

export async function authFetch(
  input: RequestInfo | URL,
  init: RequestInit = {}
) {
  const token = getAccessToken();
  const headers = new Headers(init.headers || {});
  if (token) headers.set("Authorization", `Bearer ${token}`);
  return fetch(input, { ...init, headers });
}
