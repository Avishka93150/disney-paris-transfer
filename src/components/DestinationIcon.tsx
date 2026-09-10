import type { DestinationKind } from '@/lib/prices';

/** Decorative SVGs for departure/arrival — the select's own label is the name. */
export function DestinationIcon({
  kind,
  className = 'h-4 w-4',
}: {
  kind: DestinationKind;
  className?: string;
}) {
  const common = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className,
    'aria-hidden': true,
  };

  if (kind === 'airport') {
    return (
      <svg {...common}>
        <path d="M3.5 12.5 21 9.2l-2.2 4.6L21 18.4 3.5 15.2v-2.7Z" />
        <path d="M9.2 12.2 7 6.2h1.7l3.4 6" />
        <path d="M9.4 14.8 7.4 18.8h1.7l3.1-4" />
      </svg>
    );
  }

  if (kind === 'city') {
    return (
      <svg {...common}>
        <path d="M4 20V9l4-2.5V20" />
        <path d="M8 20V6l6-3v17" />
        <path d="M14 20v-8h6v8" />
        <path d="M16.2 14.2h1.6M16.2 16.6h1.6" />
        <path d="M5.8 12h1.4M5.8 14.5h1.4M10.2 9h1.5M10.2 11.5h1.5M10.2 14h1.5" />
      </svg>
    );
  }

  if (kind === 'castle') {
    return (
      <svg {...common}>
        <path d="M4 20V10l3-2v2l3-3 3 3V8l3 2v10" />
        <path d="M4 10V7.5h2.2V10M17.8 10V7.5H20V10" />
        <path d="M11 20v-4h2v4" />
        <path d="M12 5.2 12.8 7h-1.6L12 5.2Z" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <circle cx="12" cy="12" r="8.2" />
      <path d="M12 5.5v2.2M12 16.3v2.2M5.5 12h2.2M16.3 12h2.2" />
      <path d="m12 12 3.2-4.4" />
      <circle cx="12" cy="12" r="1.15" fill="currentColor" stroke="none" />
    </svg>
  );
}
