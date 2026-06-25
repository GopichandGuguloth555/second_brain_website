import { GoogleLogin } from '@react-oauth/google';

interface GoogleSignInButtonProps {
  onSuccess: (credential: string) => void;
  onError: (message: string) => void;
  label?: 'signin' | 'signup';
}

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

export const GoogleSignInButton = ({ onSuccess, onError, label = 'signin' }: GoogleSignInButtonProps) => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;
  const text = label === 'signup' ? 'signup_with' : 'signin_with';

  if (!clientId) {
    return (
      <button
        type="button"
        onClick={() =>
          onError(
            'Google login is not configured yet. Add VITE_GOOGLE_CLIENT_ID to frontend/.env and restart the dev server.'
          )
        }
        className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg bg-white text-zinc-800 hover:bg-zinc-100 transition-all text-sm font-medium shadow-sm"
      >
        <GoogleIcon />
        Continue with Google
      </button>
    );
  }

  return (
    <div className="w-full flex justify-center overflow-hidden rounded-lg [&>div]:!w-full [&_iframe]:!w-full">
      <GoogleLogin
        onSuccess={(res) => {
          if (res.credential) onSuccess(res.credential);
          else onError('Google sign-in did not return a credential.');
        }}
        onError={() => onError('Google sign-in was cancelled or failed.')}
        theme="filled_blue"
        size="large"
        width="360"
        text={text}
        shape="rectangular"
      />
    </div>
  );
};
