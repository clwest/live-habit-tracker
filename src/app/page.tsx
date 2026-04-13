export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-zinc-50 px-6 py-24 text-center font-sans dark:bg-black">
      <div className="flex flex-col items-center gap-4">
        <span className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
          Live build in progress
        </span>
        <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
          Live Habit Tracker
        </h1>
        <p className="max-w-md text-base text-zinc-600 dark:text-zinc-400">
          A minimal, production-minded habit tracker — scaffolded and deployed
          on stream. Auth + dashboard coming next.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Framework", value: "Next.js 16" },
          { label: "Database", value: "Postgres" },
          { label: "ORM", value: "Prisma" },
          { label: "Deploy", value: "Vercel" },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-lg border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950"
          >
            <div className="text-[11px] uppercase tracking-wide text-zinc-500">
              {item.label}
            </div>
            <div className="mt-1 text-sm font-medium text-zinc-900 dark:text-zinc-50">
              {item.value}
            </div>
          </div>
        ))}
      </div>

      <footer className="text-xs text-zinc-500">
        Built with Rigby (PA) + Claude Code. Source:{" "}
        <a
          href="https://github.com/clwest/live-habit-tracker"
          className="underline hover:text-zinc-900 dark:hover:text-zinc-50"
        >
          github.com/clwest/live-habit-tracker
        </a>
      </footer>
    </main>
  );
}
