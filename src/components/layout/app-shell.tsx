import { ReactNode } from 'react';
import { Header } from './header';
import { Sidebar } from './sidebar';

type Props = {
  children: ReactNode;
};

export function AppShell({ children }: Props) {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <Header />
      <div className="flex min-h-[calc(100vh-65px)]">
        <Sidebar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}