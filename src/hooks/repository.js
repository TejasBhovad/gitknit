import { getRepositoriesByEmail } from "@/db/repository";
import { useQueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { addRepository } from "@/db/repository";

export function useFetchRepositories(email) {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ["repositories", email],
    queryFn: async () => await getRepositoriesByEmail({ email }),
    enabled: !!email,
    onSuccess: (data) => {
      queryClient.setQueryData(["repositories", email], data);
    },
  });
}

export function useCreateRepositoryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addRepository,
    onSuccess: (data) => {
      console.log("Repository created successfully", data);
      queryClient.invalidateQueries({ queryKey: ["repositories"] });
    },
    onError: (error) => {
      console.error("Error creating repository", error);
    },
  });
}
