import { ReactNode } from 'react';
import { Header } from './header';
import { Sidebar } from './sidebar';

type Props = {
  children: ReactNode;
};

export function AppShell({ children }: Props) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}