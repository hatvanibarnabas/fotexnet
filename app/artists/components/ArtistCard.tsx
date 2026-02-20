import Image from "next/image";
import type { Artist } from "@/app/types/artist";

interface ArtistCardProps {
  artist: Artist;
  index: number;
  position: number;
}

function getAlbumLabel(artist: Artist): string {
  const count = artist.albumCount ?? 0;
  if (count > 0) return `${count} album`;
  return "—";
}

export function ArtistCard({ artist, index, position }: ArtistCardProps) {
  const imageUrl = artist.image;
  const albumLabel = getAlbumLabel(artist);

  return (
    <article
      className="flex flex-col h-full overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-zinc-700 dark:bg-zinc-900"
      data-index={index}
    >
      <div className="relative aspect-square w-full bg-zinc-100 dark:bg-zinc-800">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
            unoptimized
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center text-4xl font-light text-zinc-400 dark:text-zinc-500"
            aria-hidden
          >
            {artist.name.charAt(0)}
          </div>
        )}
        <span
          className="absolute left-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-sm font-bold text-white shadow"
          aria-hidden
        >
          {position}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-3">
        <h2 className="font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-2">
          {artist.name}
        </h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-1">
          {albumLabel}
        </p>
      </div>
    </article>
  );
}
