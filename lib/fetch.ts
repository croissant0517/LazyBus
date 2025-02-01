import { useMemo, useState, useEffect, useCallback } from "react";

export const fetchAPI = async (url: string, options?: RequestInit) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};

export const useFetch = <T>(): [
  (
    url: string,
    options?: RequestInit
  ) => Promise<{
    data: T | null;
    loading: boolean;
    error: string | null;
  }>,
  { data: T | null; loading: boolean; error: string | null }
] => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (url: string, options?: RequestInit) => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchAPI(url, options);
      setData(result);
      return { data: result, loading: false, error: null };
    } catch (err) {
      setError((err as Error).message);
      return { data: null, loading: false, error: (err as Error).message };
    } finally {
      setLoading(false);
    }
  };

  return [fetchData, { data, loading, error }];
};
