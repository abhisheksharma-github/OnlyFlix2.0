import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { setUser, clearError, loginUser, registerUser, logoutUser, checkSession } from "../redux/authSlice";

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated, isCheckingAuth, isLoading } = useSelector((state) => state.auth);

  // Check existing session on mount using the checkSession thunk
  // (manages isCheckingAuth via pending/fulfilled/rejected extra reducers)
  const checkAuth = useCallback(() => {
    dispatch(checkSession());
  }, [dispatch]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (credentials) => {
    const result = await dispatch(loginUser(credentials));
    if (loginUser.fulfilled.match(result)) {
      toast.success(`Welcome back, ${result.payload.fullName}!`);
      navigate("/browse");
      return true;
    } else {
      toast.error(result.payload || "Failed to sign in.");
      return false;
    }
  };

  const register = async (payload) => {
    const result = await dispatch(registerUser(payload));
    if (registerUser.fulfilled.match(result)) {
      toast.success("Account created successfully!");
      navigate("/browse");
      return true;
    } else {
      toast.error(result.payload || "Failed to create account.");
      return false;
    }
  };

  const logout = async () => {
    await dispatch(logoutUser());
    toast.success("Signed out successfully.");
    navigate("/");
  };

  return {
    user,
    isAuthenticated,
    isCheckingAuth,
    isLoading,
    login,
    register,
    logout,
    checkAuth,
    clearError: () => dispatch(clearError()),
  };
};
