import axios from "axios";

// Function to log in a user
export const loginUser = async (email, password) => {
  const endpoint = "/api/users/login";
  const payload = { email, password };

  try {
    await axios.post(endpoint, payload, { withCredentials: true });
    return true; // Login successful
  } catch (err) {
    console.error("Error during login:", err.response?.data?.error || err.message);
    throw new Error(err.response?.data?.error || "Failed to log in.");
  }
};

// Function to register a user
export const registerUser = async (name, email, password) => {
  const endpoint = "/api/users/register";
  const payload = { name, email, password };

  try {
    await axios.post(endpoint, payload, { withCredentials: true });
    return true; // Registration successful
  } catch (err) {
    console.error("Error during registration:", err.response?.data?.error || err.message);
    throw new Error(err.response?.data?.error || "Failed to register.");
  }
};

// Function to log out a user
export const logoutUser = async () => {
  const endpoint = "/api/users/logout";

  try {
    await axios.post(endpoint, {}, { withCredentials: true });
    return true; // Logout successful
  } catch (err) {
    console.error("Error during logout:", err.response?.data?.error || err.message);
    throw new Error(err.response?.data?.error || "Failed to log out.");
  }
};

// Function to check if a user is logged in
export const isUserLoggedIn = async () => {
  const endpoint = "/api/users/checklogin";

  try {
    const response = await axios.get(endpoint, { withCredentials: true });
    return response.data.status === "logged_in"; // Return true if logged in
  } catch {
    return false; // Return false if not logged in
  }
};