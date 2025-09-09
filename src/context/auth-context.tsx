import React from "react";

interface AuthContextType {
  token: string;
  username: string;
  userId: string;
  login: (token: string, username: string, userId: string) => void;
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextType>({
  token: "",
  username: "",
  userId: "",
  login: () => {},
  logout: () => {},
});

export default AuthContext;
