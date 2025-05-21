import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const adminApi = axios.create({
  baseURL: "/api/admin",
  withCredentials: true,
});

// Hooks for Users
export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data } = await adminApi.get("/users");
      return data;
    },
  });
};

export const useUser = (id) => {
  return useQuery({
    queryKey: ["users", id],
    queryFn: async () => {
      const { data } = await adminApi.get(`/users/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, userData }) => {
      const { data } = await adminApi.patch(`/users/${id}`, userData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await adminApi.delete(`/users/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

// Hooks for Polls
export const useAdminPolls = () => {
  return useQuery({
    queryKey: ["admin-polls"],
    queryFn: async () => {
      const { data } = await adminApi.get("/polls");
      return data;
    },
  });
};

export const useAdminPoll = (id) => {
  return useQuery({
    queryKey: ["admin-polls", id],
    queryFn: async () => {
      const { data } = await adminApi.get(`/polls/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

export const useUpdatePoll = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, pollData }) => {
      const { data } = await adminApi.patch(`/polls/${id}`, pollData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-polls"] });
    },
  });
};

export const useDeletePoll = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await adminApi.delete(`/polls/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-polls"] });
    },
  });
};

// Stats Hook
export const useAdminStats = () => {
  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const { data } = await adminApi.get("/stats");
      return data;
    },
  });
};
