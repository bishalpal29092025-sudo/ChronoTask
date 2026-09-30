"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function AuthStatus() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="h-9 w-24 animate-pulse rounded-lg bg-white/5" />
    );
  }

  if (!session?.user) {
    return (
      <Link
        href="/login"
        className="rounded-lg bg-cyan-400 px-4 py-2 text-sm font-semibold text-black transition hover:bg-cyan-300"
      >
        Login
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="hidden text-right sm:block">
        <p className="text-sm font-medium text-white">
          {session.user.name || "User"}
        </p>

        <p className="text-xs text-zinc-500">
          {session.user.email}
        </p>
      </div>

      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-cyan-400 to-violet-500 text-sm font-bold text-black">
        {(session.user.name || "U").charAt(0).toUpperCase()}
      </div>

      <button
        type="button"
        onClick={() => signOut({ redirectTo: "/login" })}
        className="rounded-lg border border-white/10 px-3 py-2 text-sm font-medium text-zinc-300 transition hover:bg-white/5 hover:text-white"
      >
        Logout
      </button>
    </div>
  );
}