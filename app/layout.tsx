import type { Metadata } from 'next';
import './globals.css';
import './smart.css';

export const metadata: Metadata = {
  title: 'IRONFORM',
  description: 'Training log for a higher standard.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
