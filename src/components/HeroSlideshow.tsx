'use client';

import { useEffect, useState } from 'react';
import { HERO_PHOTOS } from '@/lib/transfersMenu';

/**
 * Fading photo background for the home hero. Honours reduced-motion by
 * keeping the first frame still.
 *
 * Plain `<img>` (not next/image): the files in `public/transfers` are JPEGs
 * saved as `.png`, and the optimizer 400s them so the hero looked empty.
 */
export function HeroSlideshow() {
  const [index, setIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduceMotion(media.matches);
    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    if (reduceMotion || HERO_PHOTOS.length < 2) return;
    const timer = window.setInterval(
      () => setIndex((current) => (current + 1) % HERO_PHOTOS.length),
      6500,
    );
    return () => window.clearInterval(timer);
  }, [reduceMotion]);

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      {HERO_PHOTOS.map((src, photoIndex) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={src}
          src={src}
          alt=""
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
            photoIndex === index ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-ink/25" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/55 via-ink/25 to-ink/10" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-cream to-transparent" />
    </div>
  );
}
