"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import type { ArtistType } from "@/app/types/artist";

function useDebouncedCallback<A extends unknown[]>(
  fn: (...args: A) => void,
  ms: number
): (...args: A) => void {
  const ref = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  return useCallback(
    (...args: A) => {
      if (ref.current) clearTimeout(ref.current);
      ref.current = setTimeout(() => fn(...args), ms);
    },
    [fn, ms]
  );
}

const TYPES: { value: ArtistType; label: string }[] = [
  { value: "is_composer", label: "Szerző" },
  { value: "is_performer", label: "Előadó" },
  { value: "is_primary", label: "Elsődleges" },
];

interface FiltersProps {
  letters: string[];
  initialSearch?: string;
  initialType?: string;
  initialLetter?: string;
}

export function Filters({
  letters,
  initialSearch = "",
  initialType = "",
  initialLetter = "",
}: FiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const updateParams = useCallback(
    (updates: Record<string, string | undefined>) => {
      const next = new URLSearchParams(searchParams?.toString() ?? "");
      next.set("page", "1");
      for (const [key, value] of Object.entries(updates)) {
        if (value === undefined || value === "") next.delete(key);
        else next.set(key, value);
      }
      startTransition(() => {
        router.push(`?${next.toString()}`, { scroll: false });
      });
    },
    [router, searchParams]
  );

  const [localSearch, setLocalSearch] = useState(initialSearch);
  useEffect(() => {
    setLocalSearch(initialSearch);
  }, [initialSearch]);

  const applySearch = useCallback(
    (value: string) => {
      updateParams({ search: value.trim() || undefined });
    },
    [updateParams]
  );
  const debouncedApplySearch = useDebouncedCallback(applySearch, 350);

  const onSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;
      setLocalSearch(v);
      debouncedApplySearch(v);
    },
    [debouncedApplySearch]
  );

  const onTypeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const v = e.target.value as ArtistType | "";
      updateParams({ type: v || undefined });
    },
    [updateParams]
  );

  const onLetterChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const v = e.target.value;
      updateParams({ letter: v || undefined });
    },
    [updateParams]
  );

  return (
    <div
      className="flex flex-wrap items-end gap-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-900"
      aria-busy={isPending}
    >
      <label className="flex flex-1 min-w-[200px] flex-col gap-1">
        <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
          Keresés
        </span>
        <input
          type="search"
          placeholder="Név szerint..."
          value={localSearch}
          onChange={onSearchChange}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500"
          aria-label="Keresés név szerint"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
          Típus
        </span>
        <select
          value={initialType}
          onChange={onTypeChange}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 min-w-[140px]"
          aria-label="Művész típus"
        >
          <option value="">Összes</option>
          {TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
          Betű
        </span>
        <select
          value={initialLetter}
          onChange={onLetterChange}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 min-w-[60px]"
          aria-label="Kezdőbetű"
        >
          <option value="">Összes</option>
          {letters.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
