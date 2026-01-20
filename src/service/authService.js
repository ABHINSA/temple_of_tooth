import axios from "axios";

// Base URL for the API
const BASE_URL = "https://daladamaligawa.dockyardsoftware.com";

// Login with User ID (Service Number) and Password
export const loginWithPassword = async (serviceNo, password) => {
  const url = `${BASE_URL}/Login/UserLogin?serviceNo=${serviceNo}&password=${encodeURIComponent(password)}`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error logging in with password:", error);
    throw error.response
      ? error.response.data
      : { message: "Server Error. Unable to login." };
  }
};

// Authenticate phone number - check if phone number is registered
export const authenticatePhoneNo = async (phoneNumber) => {
  const headers = {
    "Content-Type": "application/json",
  };

  const url = `${BASE_URL}/UserRegister/AuthenticatePhoneNo`;

  try {
    const response = await axios.post(url, { MobileNo: phoneNumber }, { headers });
    return response.data;
  } catch (error) {
    console.error("Error authenticating phone number:", error);
    throw error.response
      ? error.response.data
      : { message: "Server Error. Unable to authenticate phone number." };
  }
};

// Send OTP verification call
export const verificationCall = async (phoneNumber) => {
  const headers = {
    "Content-Type": "application/json",
  };

  // Remove '+' if present
  const plainPhoneNumber = phoneNumber.replace("+", "");

  const url = `${BASE_URL}/UserRegister/SendOTP`;
  const body = { MobileNo: plainPhoneNumber };

  try {
    const response = await axios.post(url, body, { headers });
    return response.data;
  } catch (error) {
    console.error("Error sending verification call:", error);
    throw error.response
      ? error.response.data
      : { message: "Server Error. Unable to send verification call." };
  }
};

// Fetch user data after login
export const fetchUserData = async (phoneNumber) => {
  const headers = {
    "Content-Type": "application/json",
  };

  // Clean the phone number
  const cleanNumber = phoneNumber.replace(/[^0-9+]/g, '');

  const url = `${BASE_URL}/UserRegister/GetUserData`;

  try {
    const response = await axios.post(url, { MobileNo: cleanNumber }, { headers });
    
    if (response?.data) {
      return {
        success: true,
        data: response.data,
        phoneFormat: cleanNumber
      };
    }
    return { success: false };
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error.response
      ? error.response.data
      : { message: "Server Error. Unable to fetch user data." };
  }
};
