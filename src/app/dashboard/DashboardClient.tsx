"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Habit = {
  id: string;
  title: string;
  cadence: "DAILY" | "WEEKLY";
  doneToday: boolean;
};

export function DashboardClient({ initialHabits }: { initialHabits: Habit[] }) {
  const router = useRouter();
  const [habits, setHabits] = useState<Habit[]>(initialHabits);
  const [title, setTitle] = useState("");
  const [cadence, setCadence] = useState<"DAILY" | "WEEKLY">("DAILY");
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function createHabit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const trimmed = title.trim();
    if (!trimmed) return;

    setPending("create");
    const res = await fetch("/api/habits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: trimmed, cadence }),
    });
    setPending(null);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Failed to create");
      return;
    }
    const { habit } = await res.json();
    setHabits((prev) => [...prev, { ...habit, doneToday: false }]);
    setTitle("");
  }

  async function toggleHabit(id: string) {
    setPending(id);
    const res = await fetch(`/api/habits/${id}/toggle`, { method: "POST" });
    setPending(null);
    if (!res.ok) {
      setError("Failed to toggle");
      return;
    }
    const { doneToday } = await res.json();
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, doneToday } : h)),
    );
  }

  async function deleteHabit(id: string) {
    if (!confirm("Delete this habit and all its history?")) return;
    setPending(id);
    const res = await fetch(`/api/habits/${id}`, { method: "DELETE" });
    setPending(null);
    if (!res.ok) {
      setError("Failed to delete");
      return;
    }
    setHabits((prev) => prev.filter((h) => h.id !== id));
    router.refresh();
  }

  const completedCount = habits.filter((h) => h.doneToday).length;

  return (
    <div className="flex flex-col gap-6">
      <form
        onSubmit={createHabit}
        className="flex flex-col gap-3 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
      >
        <div className="flex gap-2">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="New habit (e.g. Drink water)"
            maxLength={100}
            className="flex-1 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-100"
          />
          <select
            value={cadence}
            onChange={(e) => setCadence(e.target.value as "DAILY" | "WEEKLY")}
            className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
          >
            <option value="DAILY">Daily</option>
            <option value="WEEKLY">Weekly</option>
          </select>
          <button
            type="submit"
            disabled={pending === "create" || !title.trim()}
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Add
          </button>
        </div>
        {error && <p className="text-xs text-red-600">{error}</p>}
      </form>

      {habits.length > 0 && (
        <div className="text-sm text-zinc-500">
          {completedCount} of {habits.length} done today
        </div>
      )}

      <ul className="flex flex-col gap-2">
        {habits.map((h) => (
          <li
            key={h.id}
            className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950"
          >
            <button
              onClick={() => toggleHabit(h.id)}
              disabled={pending === h.id}
              aria-label={h.doneToday ? "Mark not done" : "Mark done"}
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors disabled:opacity-50 ${
                h.doneToday
                  ? "border-emerald-600 bg-emerald-600 text-white hover:bg-emerald-700"
                  : "border-zinc-300 bg-white text-transparent hover:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900"
              }`}
            >
              {h.doneToday ? "✓" : ""}
            </button>
            <div className="flex flex-1 flex-col">
              <span
                className={`text-sm font-medium ${
                  h.doneToday
                    ? "text-zinc-500 line-through"
                    : "text-zinc-900 dark:text-zinc-50"
                }`}
              >
                {h.title}
              </span>
              <span className="text-[11px] uppercase tracking-wide text-zinc-500">
                {h.cadence.toLowerCase()}
              </span>
            </div>
            <button
              onClick={() => deleteHabit(h.id)}
              disabled={pending === h.id}
              className="text-xs text-zinc-500 hover:text-red-600 disabled:opacity-50"
            >
              Delete
            </button>
          </li>
        ))}

        {habits.length === 0 && (
          <li className="rounded-lg border border-dashed border-zinc-300 p-6 text-center text-sm text-zinc-500 dark:border-zinc-700">
            No habits yet. Add one above to get started.
          </li>
        )}
      </ul>
    </div>
  );
}
