'use client';

import { useState, useEffect, useRef } from 'react';

export type CategoryCount = {
  name: string;
  count: number;
};

export default function CategoryHamburger({ categories }: { categories: CategoryCount[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const scrollToCategory = (category: string) => {
    setIsOpen(false);
    const element = document.getElementById(`category-${category.replace(/\s+/g, '-')}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div ref={containerRef} className="category-menu" style={{ position: 'relative' }}>
      <button onClick={() => setIsOpen((value) => !value)} className="btn btn-secondary" type="button">
        Browse categories
      </button>

      <div
        className={`category-menu-panel ${isOpen ? 'show' : ''}`}
      >
        <ul className="category-menu-list">
          {categories.map((category) => (
            <li key={category.name}>
              <button
                onClick={() => scrollToCategory(category.name)}
                type="button"
                className="category-menu-item"
              >
                <span>{category.name}</span>
                <span className="category-menu-count">
                  {category.count}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
