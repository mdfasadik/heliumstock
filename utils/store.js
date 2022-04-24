import Cookies from "js-cookie";
import React from "react";
import jwtDecode from "jwt-decode";

export const Store = React.createContext();

const storeState = {
  authToken: Cookies.get("authToken")
    ? jwtDecode(Cookies.get("authToken"))
    : null,
};

export function StoreProvider({ children }) {
  return <Store.Provider value={storeState}>{children}</Store.Provider>;
}
