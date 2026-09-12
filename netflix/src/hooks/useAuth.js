import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { authApi } from "../api/client";
import { setUser, setLoading, setCheckingAuth, logoutUser } from "../redux/authSlice";

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated, isCheckingAuth, isLoading } = useSelector((state) => state.auth);

  // Check existing session on mount
  const checkAuth = useCallback(async () => {
    try {
      dispatch(setCheckingAuth(true));
      const res = await authApi.getMe();
      if (res?.data?.user) {
        dispatch(setUser(res.data.user));
      } else {
        dispatch(setUser(null));
      }
    } catch {
      dispatch(setUser(null));
    } finally {
      dispatch(setCheckingAuth(false));
    }
  }, [dispatch]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (credentials) => {
    try {
      dispatch(setLoading(true));
      const res = await authApi.login(credentials);
      dispatch(setUser(res.data.user));
      toast.success(res.message || `Welcome back, ${res.data.user.fullName}!`);
      navigate("/browse");
      return true;
    } catch (err) {
      toast.error(err.message || "Failed to sign in.");
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const register = async (payload) => {
    try {
      dispatch(setLoading(true));
      const res = await authApi.register(payload);
      dispatch(setUser(res.data.user));
      toast.success(res.message || "Account created successfully!");
      navigate("/browse");
      return true;
    } catch (err) {
      toast.error(err.message || "Failed to create account.");
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
      dispatch(logoutUser());
      toast.success("Signed out successfully.");
      navigate("/");
    } catch {
      dispatch(logoutUser());
      navigate("/");
    }
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
  };
};
