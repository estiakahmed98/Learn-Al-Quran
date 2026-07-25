const API_URL = process.env.API_URL || "http://127.0.0.1:8000/api/v1";

export class ApiError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(status: number, message: string, errors?: Record<string, string[]>) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value) && !(value instanceof Date);
}

function snakeToCamelKey(key: string): string {
  return key.replace(/_([a-z0-9])/g, (_, c: string) => c.toUpperCase());
}

export function snakeToCamel<T = unknown>(value: unknown): T {
  if (Array.isArray(value)) {
    return value.map((item) => snakeToCamel(item)) as T;
  }
  if (isPlainObject(value)) {
    const result: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value)) {
      result[snakeToCamelKey(key)] = snakeToCamel(val);
    }
    return result as T;
  }
  return value as T;
}

function camelToSnakeKey(key: string): string {
  return key.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);
}

/** Converts an outgoing request body's keys from camelCase to snake_case for Laravel. Leaves Date/File/Blob values untouched. */
export function camelToSnake<T = unknown>(value: unknown): T {
  if (Array.isArray(value)) {
    return value.map((item) => camelToSnake(item)) as T;
  }
  if (typeof File !== "undefined" && value instanceof File) return value as T;
  if (typeof Blob !== "undefined" && value instanceof Blob) return value as T;
  if (isPlainObject(value)) {
    const result: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value)) {
      result[camelToSnakeKey(key)] = camelToSnake(val);
    }
    return result as T;
  }
  return value as T;
}

type FetchOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  token?: string;
  searchParams?: Record<string, string | number | boolean | undefined>;
  next?: NextFetchRequestConfig;
  cache?: RequestCache;
};

function buildUrl(path: string, searchParams?: FetchOptions["searchParams"]): string {
  const url = new URL(path.replace(/^\//, ""), `${API_URL}/`);
  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      if (value !== undefined) url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

async function rawFetch(path: string, options: FetchOptions = {}): Promise<unknown> {
  const { method = "GET", body, token, searchParams, next, cache } = options;
  const isFormData = body instanceof FormData;

  const headers: Record<string, string> = { Accept: "application/json" };
  if (!isFormData) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(buildUrl(path, searchParams), {
    method,
    headers,
    body: body === undefined ? undefined : isFormData ? (body as FormData) : JSON.stringify(camelToSnake(body)),
    next,
    cache
  });

  if (res.status === 204) return null;

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const message = (data && (data as any).message) || `Request failed with status ${res.status}`;
    throw new ApiError(res.status, message, (data as any)?.errors);
  }

  return data;
}

/** Fetches from the Laravel API and normalizes response keys from snake_case to camelCase. */
export async function apiFetch<T = unknown>(path: string, options?: FetchOptions): Promise<T> {
  const data = await rawFetch(path, options);
  return snakeToCamel<T>(data);
}

/** Fetches a Laravel paginate() envelope, returning { data, total, meta } normalized to camelCase. */
async function apiFetchPaginated<T = unknown>(
  path: string,
  options?: FetchOptions
): Promise<{ data: T[]; total: number; currentPage: number; lastPage: number }> {
  const raw = await rawFetch(path, options);
  const camel = snakeToCamel<any>(raw);
  return {
    data: camel.data ?? [],
    total: camel.meta?.total ?? camel.data?.length ?? 0,
    currentPage: camel.meta?.currentPage ?? 1,
    lastPage: camel.meta?.lastPage ?? 1
  };
}

export type ApiUser = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  whatsapp?: string | null;
  address?: string | null;
  description?: string | null;
  designation?: string | null;
  imageUrl?: string | null;
  role: "ADMIN" | "TEACHER" | "STUDENT";
  studentStatus: "FREE_TRIAL" | "REGULAR";
  isActive: boolean;
  permissions: string[];
  enrollmentsCount?: number;
  createdAt?: string;
  updatedAt?: string;
};

export const api = {
  auth: {
    login: (email: string, password: string) =>
      apiFetch<{ user: ApiUser; token: string }>("auth/login", {
        method: "POST",
        body: { email, password }
      }),
    me: (token: string) => apiFetch<ApiUser>("auth/me", { token, cache: "no-store" }),
    logout: (token: string) => apiFetch("auth/logout", { method: "POST", token })
  },

  courses: {
    list: (params?: { perPage?: number }, token?: string) =>
      apiFetchPaginated<any>("courses", {
        token,
        searchParams: { per_page: params?.perPage },
        next: { revalidate: 3600, tags: ["courses"] }
      }),
    get: (id: string, token?: string) => apiFetch<any>(`courses/${id}`, { token }),
    getBySlug: (slug: string, token?: string) => apiFetch<any>(`courses/slug/${slug}`, { token }),
    adminCreate: (payload: unknown, token: string) =>
      apiFetch<any>("admin/courses", { method: "POST", body: payload, token }),
    adminUpdate: (id: string, payload: unknown, token: string) =>
      apiFetch<any>(`admin/courses/${id}`, { method: "PUT", body: payload, token }),
    adminDelete: (id: string, token: string) =>
      apiFetch(`admin/courses/${id}`, { method: "DELETE", token })
  },

  blogs: {
    list: (params?: { page?: number; perPage?: number }) =>
      apiFetchPaginated<any>("blogs", {
        searchParams: { page: params?.page, per_page: params?.perPage },
        next: { revalidate: 900, tags: ["blogs"] }
      }),
    get: (id: number | string) => apiFetch<any>(`blogs/${id}`),
    getBySlug: (slug: string) => apiFetch<any>(`blogs/slug/${slug}`),
    adminCreate: (payload: unknown, token: string) =>
      apiFetch<any>("admin/blogs", { method: "POST", body: payload, token }),
    adminUpdate: (id: number | string, payload: unknown, token: string) =>
      apiFetch<any>(`admin/blogs/${id}`, { method: "PUT", body: payload, token }),
    adminDelete: (id: number | string, token: string) =>
      apiFetch(`admin/blogs/${id}`, { method: "DELETE", token })
  },

  content: {
    list: (type: string, token?: string) =>
      apiFetchPaginated<any>("contents", {
        token,
        searchParams: { type, per_page: 100 },
        next: { revalidate: 3600, tags: [`content:${type}`] }
      }),
    books: () => apiFetch<any[]>("books", { next: { revalidate: 3600, tags: ["content:BOOK"] } }),
    reviews: () => apiFetch<any[]>("reviews", { next: { revalidate: 3600, tags: ["content:REVIEW"] } }),
    submitReview: (payload: { name: string; role?: string; message: string; rating: number }) =>
      apiFetch<any>("reviews", { method: "POST", body: payload }),
    adminCreate: (payload: unknown, token: string) =>
      apiFetch<any>("admin/content", { method: "POST", body: payload, token }),
    adminUpdate: (id: string, payload: unknown, token: string) =>
      apiFetch<any>(`admin/content/${id}`, { method: "PUT", body: payload, token }),
    adminDelete: (id: string, token: string) => apiFetch(`admin/content/${id}`, { method: "DELETE", token })
  },

  teachers: {
    list: () => apiFetch<ApiUser[]>("teachers", { next: { revalidate: 3600, tags: ["teachers"] } })
  },

  settings: {
    get: () => apiFetch<any>("settings", { next: { revalidate: 3600, tags: ["site-settings"] } }),
    update: (payload: unknown, token: string) =>
      apiFetch<any>("admin/settings", { method: "PUT", body: payload, token })
  },

  enrollments: {
    create: (payload: unknown) => apiFetch<any>("enrollments", { method: "POST", body: payload }),
    my: async (token: string) => (await apiFetchPaginated<any>("my/enrollments", { token, searchParams: { per_page: 100 }, cache: "no-store" })).data,
    adminList: (token: string, params?: { perPage?: number }) =>
      apiFetchPaginated<any>("admin/enrollments", { token, searchParams: { per_page: params?.perPage }, cache: "no-store" }),
    adminCreate: (payload: unknown, token: string) =>
      apiFetch<any>("admin/enrollments", { method: "POST", body: payload, token }),
    adminGet: (id: string, token: string) => apiFetch<any>(`admin/enrollments/${id}`, { token }),
    adminUpdate: (id: string, payload: unknown, token: string) =>
      apiFetch<any>(`admin/enrollments/${id}`, { method: "PUT", body: payload, token }),
    adminDelete: (id: string, token: string) => apiFetch(`admin/enrollments/${id}`, { method: "DELETE", token })
  },

  trialApplications: {
    create: (payload: unknown) => apiFetch<any>("trial-applications", { method: "POST", body: payload }),
    my: (token: string) => apiFetch<any | null>("my/trial-application", { token, cache: "no-store" }),
    adminList: (token: string) => apiFetchPaginated<any>("admin/trial-applications", { token, cache: "no-store" })
  },

  classReports: {
    list: async (token: string, params?: { perPage?: number }) =>
      (await apiFetchPaginated<any>("class-reports", { token, searchParams: { per_page: params?.perPage ?? 200 }, cache: "no-store" })).data,
    create: (payload: unknown, token: string) =>
      apiFetch<any>("class-reports", { method: "POST", body: payload, token })
  },

  classSchedules: {
    list: (courseId: string, token?: string) =>
      apiFetch<any[]>("admin/class-schedules", { token, searchParams: { course_id: courseId } }),
    create: (payload: unknown, token: string) =>
      apiFetch<any>("admin/class-schedules", { method: "POST", body: payload, token }),
    update: (id: string, payload: unknown, token: string) =>
      apiFetch<any>(`admin/class-schedules/${id}`, { method: "PUT", body: payload, token }),
    delete: (id: string, token: string) =>
      apiFetch(`admin/class-schedules/${id}`, { method: "DELETE", token })
  },

  notes: {
    list: (courseId: string, token?: string) =>
      apiFetch<any[]>("admin/notes", { token, searchParams: { course_id: courseId } }),
    create: (payload: unknown, token: string) => apiFetch<any>("admin/notes", { method: "POST", body: payload, token }),
    update: (id: string, payload: unknown, token: string) =>
      apiFetch<any>(`admin/notes/${id}`, { method: "PUT", body: payload, token }),
    delete: (id: string, token: string) => apiFetch(`admin/notes/${id}`, { method: "DELETE", token })
  },

  results: {
    list: (enrollmentId: string, token: string) =>
      apiFetch<any[]>("admin/results", { token, searchParams: { enrollment_id: enrollmentId } }),
    create: (payload: unknown, token: string) => apiFetch<any>("admin/results", { method: "POST", body: payload, token }),
    update: (id: string, payload: unknown, token: string) =>
      apiFetch<any>(`admin/results/${id}`, { method: "PUT", body: payload, token }),
    delete: (id: string, token: string) => apiFetch(`admin/results/${id}`, { method: "DELETE", token })
  },

  users: {
    adminList: (token: string, params?: { perPage?: number }) =>
      apiFetchPaginated<ApiUser>("admin/users", { token, searchParams: { per_page: params?.perPage }, cache: "no-store" }),
    adminGet: (id: string, token: string) => apiFetch<ApiUser>(`admin/users/${id}`, { token, cache: "no-store" }),
    adminCreate: (payload: unknown, token: string) => apiFetch<ApiUser>("admin/users", { method: "POST", body: payload, token }),
    adminUpdate: (id: string, payload: unknown, token: string) =>
      apiFetch<ApiUser>(`admin/users/${id}`, { method: "PUT", body: payload, token }),
    adminDelete: (id: string, token: string) => apiFetch(`admin/users/${id}`, { method: "DELETE", token })
  },

  newsletters: {
    adminList: (token: string) => apiFetch<any[]>("admin/newsletters", { token, cache: "no-store" }),
    adminCreate: (payload: unknown, token: string) =>
      apiFetch<any>("admin/newsletters", { method: "POST", body: payload, token }),
    adminUpdate: (id: string, payload: unknown, token: string) =>
      apiFetch<any>(`admin/newsletters/${id}`, { method: "PUT", body: payload, token }),
    adminDelete: (id: string, token: string) => apiFetch(`admin/newsletters/${id}`, { method: "DELETE", token }),
    send: (id: string, token: string) => apiFetch(`admin/newsletters/${id}/send`, { method: "POST", token })
  },

  subscribers: {
    subscribe: (email: string) => apiFetch("newsletter/subscribe", { method: "POST", body: { email } }),
    unsubscribe: (email: string) => apiFetch("newsletter/unsubscribe", { method: "POST", body: { email } }),
    adminList: (token: string) => apiFetch<any[]>("admin/newsletter-subscribers", { token, cache: "no-store" }),
    adminDelete: (email: string, token: string) =>
      apiFetch("admin/newsletter-subscribers", { method: "DELETE", body: { email }, token })
  },

  uploads: {
    store: (folder: string, formData: FormData, token: string) =>
      apiFetch<{ url: string }>(`admin/uploads/${folder}`, { method: "POST", body: formData, token })
  },

  analytics: {
    collect: (payload: unknown) => apiFetch("analytics/collect", { method: "POST", body: payload }),
    summary: (token: string, params: { from: string; to: string; bucket?: string }) =>
      apiFetch<any>("admin/analytics/summary", { token, searchParams: params, cache: "no-store" })
  },

  dashboard: {
    summary: (token: string) => apiFetch<any>("admin/dashboard-summary", { token, cache: "no-store" })
  }
};
