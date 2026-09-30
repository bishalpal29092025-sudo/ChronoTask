import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <main>
      <Navbar/>
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-cyan-400">
            Productivity, measured.
          </p>
          <h1 className="text-5xl font-bold tracking-tight">
            ChronoTask
          </h1>
          <p>
            Manage tasks. Track time. Understand your productivity.
          </p>
        </div>
      </div>
    </main>
  );
}
