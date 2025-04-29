import Header from '@/components/layout/header';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
  title: 'Task Management',
  description: 'Task Management Dashboard',
};

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <>
          <Header />
          {children}
    </>
  );
}
