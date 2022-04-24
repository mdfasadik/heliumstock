import http from "./httpService";
import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";

const tokenKey = "authToken";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const setAuthToken = (token) => {
  Cookies.set(tokenKey, token);
};

const login = async (payload) => {
  return http.post(`${apiUrl}/auth`, payload);
};

const register = async (payload) => {
  return http.post(`${apiUrl}/users`, payload);
};

const getCurrentUser = () => {
  try {
    const token = Cookies.get(tokenKey);
    return jwtDecode(token);
  } catch (ex) {
    return null;
  }
};
const logout = () => {
  Cookies.remove(tokenKey);
};

export default {
  setAuthToken,
  login,
  logout,
  register,
  getCurrentUser,
};
