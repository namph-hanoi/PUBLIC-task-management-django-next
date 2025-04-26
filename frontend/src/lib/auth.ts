
import { toast } from 'sonner';
import { catchErrorTyped as getResponse } from '@/lib/catchErrorTyped';
import { UserFormValue } from '@/features/auth/components/user-auth-form';

export const signIn = async (data: UserFormValue) => {
    const getAuthTokens = await fetch('/api/internal/auth/sign-in', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
      }),
    })
    const [_, response] = await getResponse(getAuthTokens.json())
    if (response.error) {
      toast.error(response.error.detail);
    } else {
      toast.success('Signed In Successfully!');
      window.location.reload()
    }
    // TODO:
    //   window.location.href = callbackUrl ?? '/dashboard';
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

