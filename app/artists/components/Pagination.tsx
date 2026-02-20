"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  total: number;
  perPage: number;
}

export function Pagination({
  currentPage,
  totalPages,
  total,
  perPage,
}: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const goToPage = useCallback(
    (page: number) => {
      if (page < 1 || page > totalPages) return;
      const next = new URLSearchParams(searchParams?.toString() ?? "");
      next.set("page", String(page));
      startTransition(() => {
        router.push(`?${next.toString()}`, { scroll: true });
      });
    },
    [router, searchParams, totalPages],
  );

  const from = (currentPage - 1) * perPage + 1;
  const to = Math.min(currentPage * perPage, total);

  if (total === 0) return null;

  return (
    <nav
      className="flex flex-wrap items-center justify-between gap-4 border-t border-zinc-200 pt-4 dark:border-zinc-700"
      aria-label="Lapozás"
      aria-busy={isPending}
    >
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        {total === 0 ? "Nincs találat" : `${from}–${to} / ${total} művész`}
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage <= 1}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:pointer-events-none disabled:opacity-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
          aria-label="Előző oldal"
        >
          Előző
        </button>
        <span className="px-2 text-sm text-zinc-600 dark:text-zinc-400">
          {currentPage} / {totalPages}
        </span>
        <button
          type="button"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:pointer-events-none disabled:opacity-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
          aria-label="Következő oldal"
        >
          Következő
        </button>
      </div>
    </nav>
  );
}
