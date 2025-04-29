import { toast } from 'sonner';
import { UserFormValue } from '@/features/auth/components/user-auth-form';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export const signIn = async (data: UserFormValue) => {
    const getAuthTokens = await fetch('/api/user/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
      }),
    })
    
    return getAuthTokens;
}
export const useSignout = () => {
  const router = useRouter();

  return useCallback(async () => {
    try {
      const res = await fetch('/api/internal/sign-out', {
        method: 'POST',
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok) {
        console.log('Signout successful:', data);
        toast.success('Signout successful');
        router.push('/');
      } else {
        throw new Error(`Signout failed. Detail: ${data}`);
      }
    } catch (error) {
      toast.error(`Signout failed: ${error}`);
      console.error('Signout failed:', error);
    }
  }, [router]);
}

