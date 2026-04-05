import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { handleGoogleSuccess, handleGoogleError } from "@/lib/oauth";

interface GoogleOAuthButtonProps {
  onSuccess?: (response: any) => void;
  onError?: () => void;
}

export const GoogleOAuthButton = ({ onSuccess, onError }: GoogleOAuthButtonProps) => {
  const handleSuccess = (credentialResponse: any) => {
    const response = handleGoogleSuccess(credentialResponse);
    if (onSuccess) {
      onSuccess(response);
    }
  };

  const handleError = () => {
    handleGoogleError();
    if (onError) {
      onError();
    }
  };

  // You need to set this to your actual Google OAuth Client ID
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID";

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="w-full">
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={handleError}
          text="signup_with"
          width="100%"
          theme="outline"
        />
      </div>
    </GoogleOAuthProvider>
  );
};

export default GoogleOAuthButton;
