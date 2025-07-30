import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// export const setSupabaseAuthToken = async (token: string) => {
//   console.log("setSupabaseAuthToken: Attempting to set session with token:", token);
//   try {
//     const { data, error } = await supabase.auth.setSession({
//       access_token: token,
//       refresh_token: '',
//     });

//     console.log('🔔⭐🤝', data);

//     if (error) {
//       console.error('setSupabaseAuthToken: Error setting Supabase session:', error.message);
//       console.error('setSupabaseAuthToken: Full error object:', error);
//       throw error;
//     }

//     console.log('setSupabaseAuthToken: Supabase session set successfully.');
//     console.log('setSupabaseAuthToken: Session data:', data);
//     if (data && data.session && data.session.user) {
//       console.log('setSupabaseAuthToken: User object found in session:', data.session.user);
//       console.log('setSupabaseAuthToken: User ID from session:', data.session.user.id);
//     } else {
//       console.warn('setSupabaseAuthToken: No user object found in session data after setSession. Check JWT claims (e.g., "sub", "exp").');
//     }

//   } catch (e) {
//     console.error('setSupabaseAuthToken: Exception during setSession:', e);
//     throw e;
//   }
// };
