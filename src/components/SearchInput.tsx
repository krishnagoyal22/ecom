'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (query.trim()) {
      router.push(`/customer?q=${encodeURIComponent(query)}`);
      return;
    }

    router.push('/customer');
  };

  return (
    <form onSubmit={handleSearch} className="search-shell fade-in">
      <input
        type="text"
        placeholder="Search bangles"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="input-field"
        aria-label="Search Kottiar bangles"
      />
      <button type="submit" className="btn btn-primary">
        Search
      </button>
    </form>
  );
}
