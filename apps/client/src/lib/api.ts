import axios from "axios";
import type { ApiResponse } from "@repo/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3002";

export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

export type ApiResult<T> = { data: T; isMocked: boolean };

export async function apiGet<T>(
  path: string,
  fallback: T,
): Promise<ApiResult<T>> {
  try {
    const { data } = await api.get<ApiResponse<T>>(path, {
      headers: { "Cache-Control": "no-store" },
    });
    return { data: data.data, isMocked: false };
  } catch {
    return { data: fallback, isMocked: true };
  }
}
