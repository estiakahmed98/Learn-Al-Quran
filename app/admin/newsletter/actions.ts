"use server";

import { getAuthSession } from "@/lib/session";
import { api } from "@/lib/api-client";

async function requireAdmin() {
  const auth = await getAuthSession();
  if (!auth || auth.session.user.role !== "ADMIN") throw new Error("Unauthorized");
  return auth;
}

export async function listNewsletters() {
  const auth = await requireAdmin();
  return api.newsletters.adminList(auth.token);
}

export async function createNewsletter(payload: { title: string; subject: string; content: string }) {
  const auth = await requireAdmin();
  return api.newsletters.adminCreate(payload, auth.token);
}

export async function updateNewsletter(id: string, payload: { title: string; subject: string; content: string }) {
  const auth = await requireAdmin();
  return api.newsletters.adminUpdate(id, payload, auth.token);
}

export async function deleteNewsletter(id: string) {
  const auth = await requireAdmin();
  await api.newsletters.adminDelete(id, auth.token);
}

export async function sendNewsletter(id: string) {
  const auth = await requireAdmin();
  return api.newsletters.send(id, auth.token);
}

export async function listSubscribers() {
  const auth = await requireAdmin();
  return api.subscribers.adminList(auth.token);
}

export async function addSubscriber(email: string) {
  await requireAdmin();
  return api.subscribers.subscribe(email);
}

export async function deleteSubscriber(email: string) {
  const auth = await requireAdmin();
  await api.subscribers.adminDelete(email, auth.token);
}
