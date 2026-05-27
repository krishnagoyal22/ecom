'use client';

import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

export type CategoryCount = {
  name: string;
  count: number;
};

export default function CategoryHamburger({ categories }: { categories: CategoryCount[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (isOpen) {
      gsap.to(menuRef.current, {
        height: 'auto',
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out',
        display: 'block',
      });

      gsap.from('.hamburger-item', {
        y: -10,
        opacity: 0,
        stagger: 0.05,
        duration: 0.2,
        ease: 'power2.out',
      });

      return;
    }

    gsap.to(menuRef.current, {
      height: 0,
      opacity: 0,
      duration: 0.2,
      ease: 'power2.in',
      onComplete: () => {
        if (menuRef.current) {
          menuRef.current.style.display = 'none';
        }
      },
    });
  }, [isOpen]);

  const scrollToCategory = (category: string) => {
    setIsOpen(false);
    const element = document.getElementById(`category-${category.replace(/\s+/g, '-')}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="category-menu" style={{ position: 'relative' }}>
      <button onClick={() => setIsOpen((value) => !value)} className="btn btn-secondary" type="button">
        Browse categories
      </button>

      <div
        ref={menuRef}
        className="category-menu-panel"
        style={{ display: 'none', opacity: 0, height: 0 }}
      >
        <ul className="category-menu-list">
          {categories.map((category) => (
            <li key={category.name} className="hamburger-item">
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
