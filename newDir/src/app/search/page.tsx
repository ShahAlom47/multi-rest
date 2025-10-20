/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Loading from '../loading';
import SearchVideoCard from '@/componets/SearchVideoCard';

const SearchResultsPage = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 12;

  const fetchResults = async (reset = false, pageNum = page) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/search?query=${query}&limit=${limit}&page=${reset ? 1 : pageNum}`
      );
      const data = await res.json();
      if (reset) {
        setResults(data);
      } else {
        setResults((prevResults) => [...prevResults, ...data]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!query) return;
    setPage(1);
    fetchResults(true, 1);
  }, [query]);

  return (
    <div className="p-4">
      <h1 className="text-sm font-semibold mb-4">
        Results for: <span className="font-normal">{query}</span>
      </h1>

      {loading && results.length === 0 ? (
        <Loading />
      ) : results.length ? (
        <>
          <ul className="space-y-2">
            {results.map((video: any, index) => (
              <SearchVideoCard key={video?.id?.videoId || index + 'video'} video={video} />
            ))}
          </ul>
      
        </>
      ) : (
        <p>No results found.</p>
      )}
    </div>
  );
};

export default SearchResultsPage;
