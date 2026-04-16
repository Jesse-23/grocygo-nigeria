import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { handleGoogleSuccess, handleGoogleError } from "@/lib/oauth";

interface GoogleOAuthButtonProps {
  onSuccess?: (response: any) => void;
  onError?: () => void;
  buttonText?: "signin_with" | "signup_with" | "continue_with";
}

export const GoogleOAuthButton = ({
  onSuccess,
  onError,
  buttonText = "signin_with",
}: GoogleOAuthButtonProps) => {
  const handleSuccess = (credentialResponse: any) => {
    handleGoogleSuccess(credentialResponse);
    if (onSuccess) {
      onSuccess(credentialResponse);
    }
  };

  const handleError = () => {
    handleGoogleError();
    if (onError) {
      onError();
    }
  };

  // Get the Client ID from environment variables
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

  // Debug check: If this logs in your browser console, your .env isn't loading
  if (!GOOGLE_CLIENT_ID) {
    console.error(
      "Google Client ID is missing! Check your .env file and restart your server.",
    );
  }

  console.log("Current Client ID:", GOOGLE_CLIENT_ID);

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID || ""}>
      <div className="w-full">
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={handleError}
          text={buttonText}
          width="280"
          theme="outline"
          shape="pill"
        />
      </div>
    </GoogleOAuthProvider>
  );
};

export default GoogleOAuthButton;
