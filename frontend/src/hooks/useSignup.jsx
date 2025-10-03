import { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export default function useSignup(url) {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useContext(AuthContext);

  const signup = async (object) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(object),
      });

      const user = await response.json();

      if (!response.ok) {
        setError(user.error || "Login failed");
        setIsLoading(false);
        return;
      }
      dispatch({ type: "LOGIN", payload: user });

      setIsLoading(false);
    } catch (err) {
      setError("Something went wrong");
      setIsLoading(false);
    }
  };

  return { signup, isLoading, error };
}
