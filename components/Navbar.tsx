import Link from "next/link";
import AuthStatus from "@/components/AuthStatus";

export default function Navbar() {
  return (
    <nav className="border-b border-white/10 bg-black/20 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Brand */}

        <Link href="/"
        className="flex items-center gap-2"
        >
          <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.8)]"/>
          <span className="text-lg font-semibold tracking-tight">
            ChronoTask
          </span>
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-6">
          <Link
            href="/dashboard"
            className="text-sm text-zinc-400 transition-colors hover:text-white"
          >
            Dashboard
          </Link>
          <Link
            href="/tasks"
            className="text-sm text-zinc-400 transition-colors hover:text-white"
          >
            Tasks
          </Link>
          <Link href="/dashboard"
          className="rounded-lg bg-cyan-400 px-4 py-2 text-sm font-medium text-black transition-all hover:bg-cyan-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.25)]">
            Get Started
          </Link>

          <AuthStatus/>
        </div>
      </div>
    </nav>
  );
}
