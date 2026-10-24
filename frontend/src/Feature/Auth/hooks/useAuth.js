import { useContext } from "react";
import { AuthContext } from "../auth.context";
import { login, register } from "../services/auth.api.jsx";
export const useAuth = () => {
  const context = useContext(AuthContext);

  const { user, setUser, loading, setLoading } = context;

  const handleLogin = async (username, email, password) => {
    setLoading(true);
    const respones = await login(username, email, password);
    setUser(respones.user);
    setLoading(false);
  };

  const handleRegister = async (username, email, password) => {
    setLoading(true);
    const respones = await register(username, email, password);
    setUser(respones.user);
    setLoading(false);
  };

  return {
    loading,
    user,
    handleLogin,
    handleRegister,
  };
};
