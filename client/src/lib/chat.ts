import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const setSupabaseAuthToken = async (token: string) => {
  console.log("setSupabaseAuthToken: Attempting to set session with token:", token);
  try {
    // The setSession method expects an access_token and refresh_token.
    // Since our custom JWT acts as the access_token for Supabase,
    // and we don't have a refresh token from Supabase itself, we pass null for refresh_token.
    const { data, error } = await supabase.auth.setSession({
      access_token: token,
      refresh_token: '', // Pass null as we don't have a Supabase-managed refresh token
    });

    console.log('🔔⭐🤝', data);

    if (error) {
      console.error('setSupabaseAuthToken: Error setting Supabase session:', error.message);
      // Log the full error object for more details
      console.error('setSupabaseAuthToken: Full error object:', error);
      throw error; // Re-throw to be caught by the calling function
    }

    console.log('setSupabaseAuthToken: Supabase session set successfully.');
    console.log('setSupabaseAuthToken: Session data:', data);
    // Check if a user object is present in the session data
    if (data && data.session && data.session.user) {
      console.log('setSupabaseAuthToken: User object found in session:', data.session.user);
      console.log('setSupabaseAuthToken: User ID from session:', data.session.user.id);
      // If your custom JWT has a 'sub' claim, it should appear here as data.session.user.id
    } else {
      console.warn('setSupabaseAuthToken: No user object found in session data after setSession. Check JWT claims (e.g., "sub", "exp").');
    }

  } catch (e) {
    console.error('setSupabaseAuthToken: Exception during setSession:', e);
    throw e; // Re-throw any exceptions
  }
};
