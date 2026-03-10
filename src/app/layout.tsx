import type { Metadata } from 'next';
import "./globals.css";
import SidebarLayout from './components/sidebar/SidebarLayout';

export const metadata: Metadata = {
  title: 'Aprendiendo con amor',
  description: 'Aprende jugando',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <SidebarLayout>{children}</SidebarLayout>
      </body>
    </html>
  );
}