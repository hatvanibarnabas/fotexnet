"use client";

import { ArtistCard } from "./ArtistCard";
import type { Artist } from "@/app/types/artist";

interface ArtistListProps {
  artists: Artist[];
  startIndex?: number;
}

export function ArtistList({ artists, startIndex = 1 }: ArtistListProps) {
  if (artists.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white py-16 text-center dark:border-zinc-700 dark:bg-zinc-900">
        <p className="text-zinc-600 dark:text-zinc-400">
          Nincs megjeleníthető művész.
        </p>
      </div>
    );
  }

  return (
    <ul
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      role="list"
    >
      {artists.map((artist, i) => (
        <li key={artist.id}>
          <ArtistCard artist={artist} index={i} position={startIndex + i} />
        </li>
      ))}
    </ul>
  );
}
