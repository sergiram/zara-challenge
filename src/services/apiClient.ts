import type { ApiError } from '../types/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

export class ApiRequestError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiRequestError';
    this.status = status;
  }
}

type QueryParams = Record<string, string | number | undefined>;

interface ApiFetchOptions {
  params?: QueryParams;
  signal?: AbortSignal;
}

export async function apiFetch<T>(
  path: string,
  { params, signal }: ApiFetchOptions = {},
): Promise<T> {
  const url = new URL(`${API_BASE_URL}${path}`);

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== '') {
        url.searchParams.set(key, String(value));
      }
    }
  }

  const response = await fetch(url, {
    headers: { 'x-api-key': API_KEY },
    signal,
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as Partial<ApiError> | null;
    throw new ApiRequestError(response.status, body?.message ?? response.statusText);
  }

  return response.json() as Promise<T>;
}
