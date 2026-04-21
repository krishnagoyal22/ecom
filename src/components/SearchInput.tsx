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
      <span className="search-icon" aria-hidden="true">
        Search
      </span>
      <input
        type="text"
        placeholder="Search by title or description"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="input-field"
        aria-label="Search products"
      />
      <button type="submit" className="btn btn-primary">
        Find products
      </button>
    </form>
  );
}
