const API_BASE_URL = "http://localhost:5000/api";

/**
 * Fetches products from the backend with optional filtering.
 */
export const fetchProducts = async (
  category?: string,
  searchQuery?: string,
) => {
  const url = new URL(`${API_BASE_URL}/products`);
  if (category && category !== "all")
    url.searchParams.append("category", category);
  if (searchQuery) url.searchParams.append("q", searchQuery);

  const response = await fetch(url.toString());
  if (!response.ok) throw new Error("Failed to fetch products");
  return response.json();
};

/**
 * Registers a new user
 */
export const registerUser = async (userData: any) => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Registration failed");
  }
  return response.json();
};

/**
 * Logs in an existing user
 */
export const loginUser = async (credentials: any) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Login failed");
  }
  return response.json();
};

/**
 * Updates the user's password
 */
export const changePassword = async (passwords: {
  currentPassword: string;
  newPassword: string;
}) => {
  const token = localStorage.getItem("grocygo_token");
  const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(passwords),
  });

  const data = await response.json();
  if (!response.ok)
    throw new Error(data.message || "Failed to update password");
  return data;
};
