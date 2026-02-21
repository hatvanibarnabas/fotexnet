"use client";

import { useArtists } from "./hooks/useArtists";
import { ArtistList } from "./components/ArtistList";
import { Filters } from "./components/Filters";
import { Pagination } from "./components/Pagination";

export function ArtistsPageClient() {
  const { artists, total, totalPages, loading, error, retry, params, letters } =
    useArtists();

  const startIndex = (params.page - 1) * params.perPage + 1;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Művészek
          </h1>
          <p className="mt-1 text-zinc-600 dark:text-zinc-400">
            Hungaroton előadók és szerzők listája
          </p>
        </header>

        <section className="mb-6">
          <Filters
            letters={letters}
            initialSearch={params.search}
            initialType={params.type ?? ""}
            initialLetter={params.letter ?? ""}
          />
        </section>

        {error && (
          <div
            className="mb-6 flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950/30"
            role="alert"
            data-testid="error-alert"
          >
            <p className="text-red-800 dark:text-red-200">{error}</p>
            <button
              type="button"
              onClick={() => retry()}
              className="w-fit rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-100 dark:border-red-700 dark:bg-red-900/30 dark:text-red-200 dark:hover:bg-red-900/50"
              data-testid="retry-button"
            >
              Próbáld újra
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div
              className="h-10 w-10 animate-spin rounded-full border-2 border-amber-500 border-t-transparent"
              aria-hidden
            />
            <span className="sr-only">Betöltés…</span>
          </div>
        ) : (
          <>
            <section className="mb-8">
              <ArtistList artists={artists} startIndex={startIndex} />
            </section>
            <Pagination
              currentPage={params.page}
              totalPages={totalPages}
              total={total}
              perPage={params.perPage}
            />
          </>
        )}
      </div>
    </div>
  );
}
