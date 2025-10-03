import { createContext, useReducer, useEffect } from "react";

const initialState = {
  user: null,
  token: localStorage.getItem("token") || null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      localStorage.setItem("token", action.payload.token);
      return { ...state, user: action.payload, token: action.payload.token };
    case "LOGOUT":
      // localStorage.removeItem("user");
      localStorage.removeItem("token");
      return {
        ...state,
        user: null,
        token: null,
      };
    default:
      return state;
  }
};

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const verifyToken = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      console.log("Verifying token:", token);
      // Verify the token with the backend
      try {
        const response = await fetch("/api/auth/verify", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data.valid) {
          dispatch({ type: "LOGIN", payload: data.user });
        } else {
          dispatch({ type: "LOGOUT" });
        }
      } catch (error) {
        console.error("Error verifying token:", error);
        dispatch({ type: "LOGOUT" });
      }
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      dispatch({ type: "LOGIN", payload: JSON.parse(storedUser) });
    }
  }, []);

  useEffect(() => {
    if (state.user) {
      localStorage.setItem("user", JSON.stringify(state.user));
    } else {
      localStorage.removeItem("user");
    }
  }, [state.user]);

  return (
    <AuthContext.Provider value={{ state, dispatch, verifyToken }}>
      {children}
    </AuthContext.Provider>
  );
};
