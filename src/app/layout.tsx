import type { ReactNode } from 'react';
import './globals.css';

/**
 * Racine technique. Les balises <html> et <body> vivent dans
 * `src/app/[locale]/layout.tsx` (pour porter le bon attribut `lang`) et dans
 * `src/app/admin/layout.tsx`.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
