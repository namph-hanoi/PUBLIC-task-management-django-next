import Header from '@/components/layout/header';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Task Management',
  description: 'Task Management Task',
};

export default async function TaskLayout({
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
