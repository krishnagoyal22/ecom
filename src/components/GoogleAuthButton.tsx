'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function GoogleAuthButton() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGoogleAuth = async () => {
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const origin = window.location.origin;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${origin}/auth/callback?next=/customer`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="oauth-stack">
      <button
        type="button"
        className="btn btn-secondary oauth-button"
        onClick={handleGoogleAuth}
        disabled={loading}
      >
        <span className="oauth-provider-mark" aria-hidden="true">
          G
        </span>
        {loading ? 'Opening Google...' : 'Continue with Google'}
      </button>
      {error ? <div className="status-message status-error">{error}</div> : null}
    </div>
  );
}
