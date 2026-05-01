const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

function getApiBaseUrl(): string {
  if (!apiBaseUrl) {
    throw new Error('NEXT_PUBLIC_API_URL is not configured.');
  }

  return apiBaseUrl.replace(/\/+$/, '');
}

function buildApiUrl(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  return `${getApiBaseUrl()}${normalizedPath}`;
}

function extractErrorMessage(payload: unknown, fallback: string): string {
  if (!payload || typeof payload !== 'object') {
    return fallback;
  }

  if ('message' in payload && typeof payload.message === 'string') {
    return payload.message;
  }

  if (
    'error' in payload &&
    typeof payload.error === 'string' &&
    payload.error.trim().length > 0
  ) {
    return payload.error;
  }

  return fallback;
}

export async function apiFetch<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const isClient = typeof window !== 'undefined';
  const isGet = !init.method || init.method.toUpperCase() === 'GET';
  const cacheKey = `manebCache:${path}`;

  try {
    const response = await fetch(buildApiUrl(path), {
      ...init,
      headers: {
        Accept: 'application/json',
        ...init.headers,
      },
    });

    const contentType = response.headers.get('content-type') ?? '';
    const payload = contentType.includes('application/json')
      ? await response.json()
      : await response.text();

    if (!response.ok) {
      throw new ApiError(
        extractErrorMessage(payload, `Request failed with status ${response.status}.`),
        response.status,
        payload,
      );
    }

    if (isClient && isGet) {
      try {
        localStorage.setItem(cacheKey, JSON.stringify(payload));
      } catch (e) {
        console.warn('Failed to cache API response:', e);
      }
    }

    return payload as T;
  } catch (error) {
    if (isClient && isGet) {
      try {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          return JSON.parse(cached) as T;
        }
      } catch (e) {
        console.warn('Failed to read API cache:', e);
      }
    }
    throw error;
  }
}
