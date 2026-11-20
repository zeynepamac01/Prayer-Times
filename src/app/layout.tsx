import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Prayer Times | Bloomington, Indiana',
  description: 'Today’s Islamic prayer times for Bloomington, Indiana, with a live next prayer countdown.',
  applicationName: 'Bloomington Prayer Times',
  themeColor: '#f7f7f2',
};
const wallpaper = `url("${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/antique-botanical-background.webp")`;
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
