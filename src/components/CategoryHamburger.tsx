'use client';

import { useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function CategoryHamburger({ categories }: { categories: string[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Toggle open/close with animation
  useGSAP(() => {
    if (isOpen) {
      gsap.to(menuRef.current, {
        height: 'auto',
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out',
        display: 'block'
      });
      // Stagger items
      gsap.from('.hamburger-item', {
        y: -10,
        opacity: 0,
        stagger: 0.05,
        duration: 0.2,
        ease: 'power2.out'
      });
    } else {
      gsap.to(menuRef.current, {
        height: 0,
        opacity: 0,
        duration: 0.2,
        ease: 'power2.in',
        onComplete: () => {
          if (menuRef.current) {
             menuRef.current.style.display = 'none';
          }
        }
      });
    }
  }, [isOpen]);

  const scrollToCategory = (category: string) => {
    setIsOpen(false);
    const element = document.getElementById(`category-${category.replace(/\s+/g, '-')}`);
    if (element) {
      // Smooth scroll using modern browser API
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div style={{ position: 'relative', marginBottom: '2rem', display: 'flex', justifyContent: 'flex-end', zIndex: 50 }}>
      {/* The Hamburger Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-secondary"
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem', 
          padding: '0.5rem 1rem',
          backgroundColor: isOpen ? 'var(--panel-bg)' : 'transparent',
          border: '1px solid var(--border-color)',
        }}
      >
        <span style={{ fontSize: '1.25rem', lineHeight: '1' }}>☰</span>
        <span>Categories</span>
      </button>

      {/* The Dropdown Menu */}
      <div 
        ref={menuRef}
        className="card"
        style={{ 
          position: 'absolute', 
          top: '100%', 
          right: 0, 
          marginTop: '0.5rem',
          padding: '0.5rem',
          minWidth: '200px',
          display: 'none', // Initially hidden, managed by GSAP
          opacity: 0,
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.3)'
        }}
      >
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {categories.map((category) => (
            <li key={category} className="hamburger-item">
              <button 
                onClick={() => scrollToCategory(category)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  background: 'none',
                  border: 'none',
                  padding: '0.75rem 1rem',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  borderRadius: '0.25rem',
                  fontSize: '0.875rem',
                  transition: 'background-color 0.2s',
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                {category}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
