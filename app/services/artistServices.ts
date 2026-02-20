import type {
  Artist,
  ArtistApiRaw,
  ArtistsApiParams,
  ArtistsApiResponse,
  ArtistsApiResponseRaw,
} from "@/app/types/artist";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://exam.api.fotex.net";

function buildArtistsUrl(params: ArtistsApiParams): string {
  const searchParams = new URLSearchParams();

  if (params.type) searchParams.set("type", params.type);
  const letter = params.letter?.trim();
  if (letter) searchParams.set("letter", letter);
  if (params.include_image !== false) searchParams.set("include_image", "true");
  if (params.search?.trim()) searchParams.set("search", params.search.trim());
  searchParams.set("page", String(params.page ?? 1));
  searchParams.set("per_page", String(params.per_page ?? 50));

  const query = searchParams.toString();
  return `${BASE_URL}/api/artists${query ? `?${query}` : ""}`;
}

function rawToArtist(raw: ArtistApiRaw): Artist {
  const image =
    typeof raw.portrait === "string"
      ? raw.portrait
      : typeof raw.image === "string"
        ? raw.image
        : raw.image && typeof raw.image === "object" && "url" in raw.image
          ? (raw.image as { url: string }).url
          : undefined;
  return {
    id: raw.id,
    name: raw.name,
    image: image ?? undefined,
    albumCount: raw.albumCount ?? raw.albums_count ?? 0,
  };
}

export async function fetchArtists(
  params: ArtistsApiParams,
): Promise<ArtistsApiResponse> {
  const url = buildArtistsUrl(params);
  const res = await fetch(url, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`Artists API error: ${res.status} ${res.statusText}`);
  }

  const json = (await res.json()) as ArtistsApiResponseRaw;

  const rawList = json.data ?? json.artists ?? [];
  const data = rawList.map(rawToArtist);

  const pag = json.pagination;
  const meta = {
    current_page: pag?.current_page ?? 1,
    total: pag?.total_items ?? data.length,
    per_page: pag?.per_page ?? 50,
    total_pages:
      pag?.total_pages ??
      (Math.ceil((pag?.total_items ?? data.length) / (pag?.per_page ?? 50)) ||
        1),
  };

  return { data, meta };
}

export { buildArtistsUrl };
