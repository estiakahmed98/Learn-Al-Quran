"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/auth/login" })}
      className="w-full rounded-full border-2 border-red-500 py-2 text-sm font-semibold text-red-500 hover:bg-red-500 hover:text-white"
    >
      Sign Out
    </button>
  );
}
