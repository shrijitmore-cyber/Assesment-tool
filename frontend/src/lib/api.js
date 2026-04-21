import axios from "axios";

const BASE = process.env.REACT_APP_BACKEND_URL;

export const api = axios.create({
  baseURL: `${BASE}/api`,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("aim_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export function formatApiError(err) {
  const d = err?.response?.data?.detail;
  if (d == null) return err?.message || "Something went wrong";
  if (typeof d === "string") return d;
  if (Array.isArray(d))
    return d
      .map((e) => (e && typeof e.msg === "string" ? e.msg : JSON.stringify(e)))
      .join(" ");
  if (d?.msg) return d.msg;
  return String(d);
}
