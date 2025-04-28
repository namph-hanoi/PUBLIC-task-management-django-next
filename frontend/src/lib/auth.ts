
import { toast } from 'sonner';
import { UserFormValue } from '@/features/auth/components/user-auth-form';

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

export const signOut = () => {
  return fetch('/api/internal/auth/sign-out', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((response) => {
    if (response.ok) {
      toast.info('Signed out successfully');
      window.location.reload()
    } else {
      toast.error('Logout failed');
    }
  }).catch((error) => {
    console.log(["🚀 ~ signOut ~ error:", error]);
    toast.error('Logout failed');
  });
}

