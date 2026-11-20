import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Prayer Times | Bloomington, Indiana',
  description: 'Today’s Islamic prayer times for Bloomington, Indiana, with a live next prayer countdown.',
  applicationName: 'Bloomington Prayer Times',
  themeColor: '#f7f7f2',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
