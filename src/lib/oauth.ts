// OAuth utility functions for handling Google authentication

export interface GoogleOAuthResponse {
  credential: string;
  clientId: string;
}

export const handleGoogleSuccess = (credentialResponse: GoogleOAuthResponse) => {
  console.log("Google OAuth Response:", credentialResponse);
  // TODO: Send the credential to your backend to verify and create/update user
  // The credential is a JWT token that should be sent to your server
  // Your server should verify this token with Google's servers
  return {
    token: credentialResponse.credential,
    clientId: credentialResponse.clientId,
  };
};

export const handleGoogleError = () => {
  console.error("Google OAuth login failed");
};

// Decode the JWT credential to get user information (for client-side display only)
export const decodeGoogleToken = (token: string) => {
  try {
    // The token is a JWT, split it and decode the payload
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
};
