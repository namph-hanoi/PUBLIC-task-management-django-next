import React from 'react';
import Link from 'next/link'; // Add this import
import { Separator } from '../ui/separator';
import { UserNav } from './user-nav';
import { ModeToggle } from './ThemeToggle/theme-toggle';
import CtaGithub from './cta-github';

export default function Header() {
  return (
    <header className='flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12'>
      <div className='flex items-center gap-2 px-4'>
        <Separator orientation='vertical' className='mr-2 h-4' />
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
        {/* NavLinks end */}
      </div>

      <div className='flex items-center gap-2 px-4'>
        <CtaGithub />
        <div className='hidden md:flex'>
        </div>
        <UserNav />
        <ModeToggle />
      </div>
    </header>
  );
}
