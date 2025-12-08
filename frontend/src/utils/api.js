export const API_BASE_URL = (
  import.meta?.env?.VITE_API_URL || "http://localhost:3000"
).replace(/\/$/, "");

export function apiUrl(path = "") {
  console.log("ALL ENV VARIABLES:", import.meta.env);
  console.log("VITE_API_URL:", import.meta.env.VITE_API_URL);
  console.log(API_BASE_URL);

  const normalizedPath = String(path || "").startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
}
