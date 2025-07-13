import { GoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { useOAuthSyncMutation } from "@/store/features/apiSlice";
import { setAccessToken, setUser } from "@/store/features/authSlice";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const GoogleLoginButton = () => {
  const router = useRouter();
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
          toast.success("Signed in Successfully");
          router.push("/onboarding/details");
        } catch (err) {
          console.error("Google OAuth sync failed", err);
        }
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
