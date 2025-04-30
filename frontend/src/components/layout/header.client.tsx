'use client';

import React from 'react';
import Link from 'next/link';
import { useGlobalStore } from '@/features/states/global';

export default function HeaderClientNav() {
  const user = useGlobalStore(state => state.user);
  const isEmployee = user?.user_role === 'employee';

  if (isEmployee) return null;

  return (
    <>
      <h3>Navigate:</h3>
      <nav className="ml-4 flex gap-3">
        <Link
          href="/dashboard"
          className="px-3 py-1 border border-gray-300 rounded hover:underline hover:border-gray-500 transition-colors"
        >
          Dashboard
        </Link>
        <Link
          href="/task"
          className="px-3 py-1 border border-gray-300 rounded hover:underline hover:border-gray-500 transition-colors"
        >
          Task
        </Link>
      </nav>
    </>
  );
}