'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/customer?q=${encodeURIComponent(query)}`);
    } else {
      router.push(`/customer`);
    }
  };

  return (
    <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }} className="fade-in">
      <input
        type="text"
        placeholder="Search for products..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="input-field"
        style={{ flex: 1 }}
      />
      <button 
        type="submit"
        className="btn btn-primary"
      >
        Search
      </button>
    </form>
  );
}
