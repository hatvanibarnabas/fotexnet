import { Suspense } from "react";
import { ArtistsPageClient } from "@/app/artists/ArtistsPageClient";

function ArtistsFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-zinc-50 dark:bg-zinc-950">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<ArtistsFallback />}>
      <ArtistsPageClient />
    </Suspense>
  );
}
