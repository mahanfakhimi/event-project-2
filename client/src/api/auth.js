import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "./client";

// Get current user profile
export const useUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data } = await apiClient.get("/auth/profile");
      return data;
    },
    retry: false,
  });
};

// Send OTP for registration
export const useSendRegistrationOTP = () => {
  return useMutation({
    mutationFn: async (email) => {
      const { data } = await apiClient.post("/auth/register/send-otp", {
        email,
      });
      return data.data;
    },
  });
};

// Verify OTP and complete registration
export const useVerifyRegistrationOTP = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ email, otp, password, name, username }) => {
      const { data } = await apiClient.post("/auth/register/verify-otp", {
        email,
        otp,
        password,
        name,
        username,
      });
      return data.user;
    },
    onSuccess(data) {
      queryClient.setQueryData(["user"], data);
    },
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ email, password }) => {
      const { data } = await apiClient.post("/auth/login", { email, password });
      return data.user;
    },
    onSuccess(data) {
      queryClient.setQueryData(["user"], data);
    },
  });
};

// Forgot password mutation
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: async (email) => {
      const { data } = await apiClient.post("/auth/forgot-password", { email });
      return data.data;
    },
  });
};

// Reset password mutation
export const useResetPassword = () => {
  return useMutation({
    mutationFn: async ({ email, otp, newPassword }) => {
      const { data } = await apiClient.post("/auth/reset-password", {
        email,
        otp,
        newPassword,
      });
      return data.data;
    },
  });
};

// Logout mutation
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await apiClient.post("/auth/logout");
      return data.data;
    },
    onSuccess: () => {
      queryClient.clear();
    },
  });
};
