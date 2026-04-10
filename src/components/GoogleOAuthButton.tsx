import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { handleGoogleSuccess, handleGoogleError } from "@/lib/oauth";

interface GoogleOAuthButtonProps {
  onSuccess?: (response: any) => void;
  onError?: () => void;
  buttonText?: "signin_with" | "signup_with" | "continue_with"; // Added prop
}

export const GoogleOAuthButton = ({ 
  onSuccess, 
  onError, 
  buttonText = "signin_with" // Default to sign in
}: GoogleOAuthButtonProps) => {
    
  const handleSuccess = (credentialResponse: any) => {
    const response = handleGoogleSuccess(credentialResponse);
    if (onSuccess) {
      onSuccess(credentialResponse); // Passing the raw response for backend verification
    }
  };

  const handleError = () => {
    handleGoogleError();
    if (onError) {
      onError();
    }
  };

  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "710473140280-qiq5ohidipr6hcj6v52stkkg8pnsc5hg.apps.googleusercontent.com";

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="w-full">
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={handleError}
          text={buttonText} // Now dynamic!
          width="100%"
          theme="outline"
          shape="pill"
        />
      </div>
    </GoogleOAuthProvider>
  );
};

export default GoogleOAuthButton;