'use client';
import { toast } from 'sonner';

export function BtnSeed() {
  return (
    <button
      type="button"
      className="relative z-20 flex items-center text-lg font-medium px-4 py-2 rounded bg-zinc-800 hover:bg-zinc-700 transition-colors"
      onClick={async () => {
        try {
          const res = await fetch('/api/seed/all', { method: 'POST' });
          if (!res.ok) throw new Error('Failed to seed data');
          toast.success('Seeding completed successfully!');
        } catch (error) {
          toast.error('Seeding failed. Please try again.');
        }
      }}
    >
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        className='mr-2 h-6 w-6'
      >
        <path d='M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3' />
      </svg>
      Click to seed
    </button>
  );
}