import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '???? ????',
  description: '?? ??????? ??? ???? ????',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hi">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <div className="mx-auto max-w-3xl p-6">
          <header className="mb-6">
            <h1 className="text-2xl font-bold">???? ????</h1>
            <p className="text-sm text-gray-600">????? ???? ?? ?? ??????? ????</p>
          </header>
          {children}
          <footer className="mt-10 text-center text-sm text-gray-500">
            ? {new Date().getFullYear()} Agentic App
          </footer>
        </div>
      </body>
    </html>
  );
}
