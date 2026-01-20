import { authenticatePhoneNo, verificationCall, fetchUserData, loginWithPassword } from "../service/authService";

// Action Types
export const AUTH_START = "AUTH_START";
export const AUTH_SUCCESS = "AUTH_SUCCESS";
export const AUTH_FAILURE = "AUTH_FAILURE";
export const RESTORE_SESSION = "RESTORE_SESSION";
export const LOAD_USER_DATA_SUCCESS = "LOAD_USER_DATA_SUCCESS";
export const LOAD_USER_DATA_FAILURE = "LOAD_USER_DATA_FAILURE";
export const LOGOUT = "LOGOUT";
export const PASSWORD_AUTH_SUCCESS = "PASSWORD_AUTH_SUCCESS";

// Restore session from localStorage
export const restoreSession = () => (dispatch) => {
  const phoneNumber = localStorage.getItem("phoneNumber");
  const serviceNo = localStorage.getItem("serviceNo");
  const userData = localStorage.getItem("userData");
  const sentOtp = localStorage.getItem("sentOtp");

  if (phoneNumber || serviceNo) {
    let parsedUserData = null;

    // Safely parse userData
    if (userData && userData !== "undefined" && userData !== "null") {
      try {
        parsedUserData = JSON.parse(userData);
      } catch (error) {
        console.warn("Failed to parse userData from localStorage:", error);
        localStorage.removeItem("userData");
      }
    }

    dispatch({
      type: RESTORE_SESSION,
      payload: {
        phoneNumber: phoneNumber || null,
        serviceNo: serviceNo || null,
        userData: parsedUserData,
        sentOtp: sentOtp || null
      }
    });
    return true;
  }
  return false;
};

// Load user data by phone number
export const loadUserData = (phoneNumber) => async (dispatch) => {
  try {
    const response = await fetchUserData(phoneNumber);

    dispatch({
      type: LOAD_USER_DATA_SUCCESS,
      payload: {
        ...response,
        correctPhoneFormat: response.correctPhoneFormat,
      },
    });
  } catch (error) {
    console.error("Error loading user data:", error);
    dispatch({
      type: LOAD_USER_DATA_FAILURE,
      payload: error,
    });
  }
};

// Action creators
export const startAuthentication = () => ({
  type: AUTH_START,
});

export const authenticationSuccess = (data) => ({
  type: AUTH_SUCCESS,
  payload: data,
});

export const authenticationFailure = (error) => ({
  type: AUTH_FAILURE,
  payload: error,
});

export const setUserData = (userData) => ({
  type: "SET_USER_DATA",
  payload: userData,
});

// Logout action
export const logout = () => (dispatch) => {
  localStorage.removeItem("phoneNumber");
  localStorage.removeItem("serviceNo");
  localStorage.removeItem("userData");
  localStorage.removeItem("sentOtp");

  dispatch({
    type: LOGOUT
  });
};

// Main authenticate action - validates phone and sends OTP
export const authenticate = (phoneNumber) => async (dispatch) => {
  dispatch(startAuthentication());
  try {
    const isValid = await authenticatePhoneNo(phoneNumber);
    if (!isValid) {
      throw { message: "Invalid phone number." };
    }

    const otpResponse = await verificationCall(phoneNumber);
    dispatch(authenticationSuccess(otpResponse));
    return { success: true, data: otpResponse };
  } catch (error) {
    dispatch(authenticationFailure(error));
    return { success: false, error };
  }
};

// Authenticate with User ID (Service Number) and Password
export const authenticateWithPassword = (serviceNo, password) => async (dispatch) => {
  dispatch(startAuthentication());
  try {
    const response = await loginWithPassword(serviceNo, password);
    
    if (response) {
      dispatch({
        type: PASSWORD_AUTH_SUCCESS,
        payload: {
          serviceNo,
          userData: response
        }
      });
      return { success: true, data: response };
    } else {
      throw { message: "Invalid credentials." };
    }
  } catch (error) {
    dispatch(authenticationFailure(error));
    return { success: false, error };
  }
};

// Resend OTP action
export const resendOtp = (phoneNumber) => async (dispatch) => {
  try {
    const resendOtpResponse = await verificationCall(phoneNumber, true);
    return { success: true, data: resendOtpResponse };
  } catch (error) {
    console.error("Error resending OTP:", error);
    return { success: false, error };
  }
};
