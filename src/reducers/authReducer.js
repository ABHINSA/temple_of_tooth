import {
  AUTH_START,
  AUTH_SUCCESS,
  AUTH_FAILURE,
  LOAD_USER_DATA_SUCCESS,
  LOAD_USER_DATA_FAILURE,
  RESTORE_SESSION,
  LOGOUT,
  PASSWORD_AUTH_SUCCESS
} from "../actions/authActions";

const initialState = {
  loading: false,
  data: null,
  error: null,
  userData: null,
  isAuthenticated: false,
  phoneNumber: null,
  serviceNo: null
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case AUTH_START:
      return { ...state, loading: true, error: null };

    case RESTORE_SESSION:
      return {
        ...state,
        isAuthenticated: true,
        phoneNumber: action.payload.phoneNumber,
        serviceNo: action.payload.serviceNo,
        userData: action.payload.userData,
        data: action.payload.phoneNumber || action.payload.serviceNo,
        loading: false,
        error: null
      };

    case LOAD_USER_DATA_SUCCESS:
      return {
        ...state,
        userData: action.payload,
        loading: false,
        error: null,
      };

    case "SET_USER_DATA":
      return {
        ...state,
        userData: action.payload,
      };

    case LOAD_USER_DATA_FAILURE:
      return {
        ...state,
        userData: null,
        loading: false,
        error: action.payload,
      };

    case AUTH_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload.phoneNumber,
        error: null
      };

    case PASSWORD_AUTH_SUCCESS:
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        serviceNo: action.payload.serviceNo,
        userData: action.payload.userData,
        error: null
      };

    case AUTH_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case LOGOUT:
      return initialState;

    default:
      return state;
  }
};

export default authReducer;
