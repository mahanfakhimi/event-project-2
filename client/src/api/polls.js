import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "./client";

// Get all polls
export const usePolls = () => {
  return useQuery({
    queryKey: ["polls"],
    queryFn: async () => {
      const { data } = await apiClient.get(`/polls`);
      return data.data;
    },
  });
};

// Get single poll
export const usePoll = (id) => {
  return useQuery({
    queryKey: ["poll", id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/polls/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
};

// Get poll results
export const usePollResults = (pollId) => {
  return useQuery({
    queryKey: ["poll-results", pollId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/polls/${pollId}/results`);
      return data.data;
    },
    enabled: !!pollId,
  });
};

// Get user's voted polls
export const useUserVotedPolls = () => {
  return useQuery({
    queryKey: ["userVotedPolls"],
    queryFn: async () => {
      const { data } = await apiClient.get(`/polls/user/votes`);
      return data.data;
    },
  });
};

// Create new poll
export const useCreatePoll = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (pollData) => {
      const { data } = await apiClient.post(`/polls`, pollData);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["polls"] });
    },
  });
};

// Submit vote
export const useSubmitVote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ pollId, optionIndex }) => {
      const { data } = await apiClient.post(`/polls/${pollId}/vote`, {
        optionIndex,
      });
      return data.data;
    },
    onSuccess: (_, { pollId }) => {
      queryClient.invalidateQueries({ queryKey: ["poll", pollId] });
      queryClient.invalidateQueries({ queryKey: ["poll-results", pollId] });
    },
  });
};
