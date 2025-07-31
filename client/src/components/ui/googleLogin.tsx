import { GoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { useOAuthSyncMutation } from "@/store/features/apiSlice";
import { setAccessToken, setUser } from "@/store/features/authSlice";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";
import { redirect } from "next/navigation";
import { store } from "@/store/store";

const GoogleLoginButton = () => {
  const dispatch = useDispatch();
  const [oauthSync] = useOAuthSyncMutation();

  return (
    <GoogleLogin
      onSuccess={async (credentialResponse) => {
        const googleToken = credentialResponse.credential;

        try {
          const response = await oauthSync({ token: googleToken }).unwrap();
          dispatch(setAccessToken(response.accessToken));

          const decoded = jwtDecode<TokenPayload>(response.accessToken);
          dispatch(setUser(decoded));
          if(store.getState().auth.user!.role == "HELP_SEEKER") {
            return toast.error("Already registered on Sahit Suppor Portal");
          }
          toast.success("Signed in Successfully");
        } catch (err) {
          console.error("Google OAuth sync failed", err);
        }

        redirect('/onboarding/details');
      }}
      onError={() => {
        console.error("Google Login Failed");
      }}
      theme="outline"
      size="large"
    />
  );
};

export default GoogleLoginButton;
