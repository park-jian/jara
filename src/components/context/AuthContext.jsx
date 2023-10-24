import { createContext, useContext, useState, useEffect } from "react";
import { login, logout, onUserStateChange } from "../../api/firebase";

const AuthContext = createContext();

export function AuthContextProvider({ children }) {
  const [user, setUser] = useState();

  useEffect(() => {
    onUserStateChange((user) => {
      setUser(user);
    });
  }, []);
  return (
    //login, logout은 key, value가 같아서 생략 가능
    //<AuthContext.Provider value={{ user, login: login, logout: logout }}>
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}
