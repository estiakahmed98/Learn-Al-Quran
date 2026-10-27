import { api, type ApiUser } from "@/lib/api-client";

export async function getAllCourses(token?: string) {
  const first = await api.courses.list({ perPage: 100 }, token, { cache: "no-store", next: undefined });
  const data = [...first.data];
  for (let page = 2; page <= first.lastPage; page++) {
    const result = await api.courses.list({ perPage: 100, page }, token, { cache: "no-store", next: undefined });
    data.push(...result.data);
  }
  return data;
}

export async function getAllTeachers(token: string): Promise<{ data: ApiUser[] }> {
  const first = await api.users.adminList(token, { perPage: 100, role: "TEACHER" });
  const data = [...first.data];
  for (let page = 2; page <= first.lastPage; page++) {
    const result = await api.users.adminList(token, { perPage: 100, page, role: "TEACHER" });
    data.push(...result.data);
  }
  return { data };
}
