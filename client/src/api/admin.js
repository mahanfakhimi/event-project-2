import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "./client";

export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data } = await apiClient.get("/admin/users");
      return Array.isArray(data) ? data : [];
    },
  });
};

export const useUser = (id) => {
  return useQuery({
    queryKey: ["users", id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/admin/users/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, userData }) => {
      const { data } = await apiClient.patch(`/admin/users/${id}`, userData);
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
      const { data } = await apiClient.delete(`/admin/users/${id}`);
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
      const { data } = await apiClient.get("/admin/polls");
      return data;
    },
  });
};

export const useAdminPoll = (id) => {
  return useQuery({
    queryKey: ["admin-polls", id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/admin/polls/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

export const useUpdatePoll = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, pollData }) => {
      const { data } = await apiClient.patch(`/admin/polls/${id}`, pollData);
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
      const { data } = await apiClient.delete(`/admin/polls/${id}`);
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
      const { data } = await apiClient.get("/admin/stats");
      return data;
    },
  });
};
