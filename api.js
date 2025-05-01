const API_BASE_URL = "https://api.goable.example.com"; // Replace with the actual API URL

/**
 * Fetch accessible places based on a search query.
 * @param {string} query - The search keyword or location.
 * @returns {Promise<Array>} - A promise that resolves to an array of accessible places.
 */
async function fetchAccessiblePlaces(query) {
  const response = await fetch(`${API_BASE_URL}/places?search=${encodeURIComponent(query)}`);
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }
  return response.json();
}