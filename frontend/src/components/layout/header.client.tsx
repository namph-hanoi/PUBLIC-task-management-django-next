'use client';

import React from 'react';
import Link from 'next/link';
import { useGlobalStore } from '@/features/states/global';
import { usePathname } from 'next/navigation';

export default function HeaderClientNav() {
  const user = useGlobalStore(state => state.user);
  const isEmployee = user?.user_role === 'employee';
  const pathname = usePathname();

  if (isEmployee) return null;

  const linkBase =
    "px-3 py-1 border border-gray-300 rounded hover:underline hover:border-gray-500 transition-colors";
  const active =
    "bg-blue-600 text-white border-blue-700 font-bold pointer-events-none shadow";

  return (
    <>
      <h3 className="text-lg font-bold">Navigate:</h3>
      <nav className="ml-4 flex gap-3">
        <Link
          href="/dashboard"
          className={
            `${linkBase} ${pathname === "/dashboard" ? active : ""}`
          }
        >
          Dashboard
        </Link>
        <Link
          href="/task"
          className={
            `${linkBase} ${pathname === "/task" ? active : ""}`
          }
        >
          Task
        </Link>
      </nav>
    </>
  );
}