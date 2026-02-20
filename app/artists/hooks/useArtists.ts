"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchArtists } from "@/app/services/artistServices";
import type { Artist, ArtistType } from "@/app/types/artist";

const PER_PAGE = 50;
const LETTERS = "AÁBCDEFGHIJKLMNOÖPQRSTUVWXYZ".split("");

function parseSearchParams(searchParams: URLSearchParams | null) {
  if (!searchParams)
    return { page: 1, search: "", type: undefined, letter: undefined };
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);
  const search = searchParams.get("search") ?? "";
  const type = (searchParams.get("type") as ArtistType | null) ?? undefined;
  const letter = searchParams.get("letter") ?? undefined;
  return { page, search, type, letter };
}

export function useArtists() {
  const searchParams = useSearchParams();
  const [data, setData] = useState<{ artists: Artist[]; total: number }>({
    artists: [],
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const params = useMemo(() => parseSearchParams(searchParams), [searchParams]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchArtists({
        page: params.page,
        per_page: PER_PAGE,
        search: params.search || undefined,
        type: params.type,
        letter: params.letter,
        include_image: true,
      });
      setData({
        artists: res.data,
        total: res.meta?.total ?? res.data?.length ?? 0,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load artists");
      setData({ artists: [], total: 0 });
    } finally {
      setLoading(false);
    }
  }, [params.page, params.search, params.type, params.letter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const totalPages = Math.ceil(data.total / PER_PAGE) || 1;

  return {
    artists: data.artists,
    total: data.total,
    totalPages,
    loading,
    error,
    retry: fetchData,
    params: { ...params, perPage: PER_PAGE },
    letters: LETTERS,
  };
}
