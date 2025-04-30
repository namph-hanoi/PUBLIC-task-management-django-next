'use client';
import { toast } from 'sonner';
import { useGlobalStore } from '../../states/global';

export function SigninViewClient() {
  const setSeedSuccess = useGlobalStore((state) => state.setSeedSuccess);
  const seedSuccess = useGlobalStore((state) => state.seedSuccess);
  const seedUserEmails = useGlobalStore((state) => state.seedUserEmails);
  const seededAccountToSignIn = useGlobalStore((state) => state.seededAccountToSignIn);
  const setSeededAccountToSignIn = useGlobalStore((state) => state.setSeededAccountToSignIn);

  return (
    <>
      <button
        type="button"
        className="relative z-20 flex items-center text-lg font-medium px-4 py-2 rounded bg-zinc-800 hover:bg-zinc-700 transition-colors"
        onClick={async () => {
          try {
            const res = await fetch('/api/seed/all', { method: 'POST' });
            if (!res.ok) {
              setSeedSuccess(true);
              throw new Error('Failed to seed data');
            }
            toast.success('Seeding completed successfully!');
            setSeedSuccess(true);
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
      
      {seedSuccess && (
        <div>
          <p className="mt-4 text-white text-xl relative">
            Seeding completed successfully! You can now log in with the seeded users.
            <br />
            Choose the email below and hit Sign In to log in as that user.
          </p>
          <select
            className="relative z-50 mt-6 block w-full rounded border-2 border-zinc-400 px-4 py-3 bg-zinc-700 text-white text-xl shadow-lg"
            style={{ minHeight: 48 }}
            value={seededAccountToSignIn ?? ""}
            onChange={e => setSeededAccountToSignIn(e.target.value)}
          >
            <option value="" disabled>
              Select an account
            </option>
            {seedUserEmails.map((email) => (
              <option key={email} value={email}>
                {email}
              </option>
            ))}
          </select>
        </div>
      )}
    </>
  );
}