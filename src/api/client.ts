const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Fetches products from the backend with optional filtering.
 * @param category - The category to filter by (e.g., 'Vegetables')
 * @param searchQuery - The search term (e.g., 'rice')
 */
export const fetchProducts = async (category?: string, searchQuery?: string) => {
  // Use URLSearchParams to handle the query string safely
  const url = new URL(`${API_BASE_URL}/products`);
  
  if (category && category !== 'all') {
    url.searchParams.append('category', category);
  }
  
  if (searchQuery) {
    url.searchParams.append('q', searchQuery);
  }

  const response = await fetch(url.toString());
  
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  
  return response.json();
};