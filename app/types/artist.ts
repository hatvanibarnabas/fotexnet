export type ArtistType = "is_composer" | "is_performer" | "is_primary";

export interface Artist {
  id: number;
  name: string;
  image?: string;
  albumCount?: number;
}

export interface ArtistApiRaw {
  id: number;
  name: string;
  portrait?: string;
  albumCount?: number;
  image?: string | { url: string };
  albums_count?: number;
  albums?: Array<{ id: number; name?: string; title?: string }>;
}

export interface ArtistsApiParams {
  type?: ArtistType;
  letter?: string;
  include_image?: boolean;
  search?: string;
  page?: number;
  per_page?: number;
}

export interface ArtistsApiPagination {
  current_page: number;
  total_pages: number;
  per_page: number;
  total_items: number;
}

export interface ArtistsApiResponseRaw {
  data?: ArtistApiRaw[];
  artists?: ArtistApiRaw[];
  pagination?: ArtistsApiPagination;
}

export interface ArtistsApiMeta {
  current_page: number;
  total: number;
  per_page: number;
  total_pages: number;
}

export interface ArtistsApiResponse {
  data: Artist[];
  meta: ArtistsApiMeta;
}
