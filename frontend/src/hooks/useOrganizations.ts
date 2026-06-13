import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import toast from "react-hot-toast";
import type { Organization } from "@/types";

const getOrganizations = async (): Promise<Organization[]> => {
  const res = await api.get("/api/org");
  return res.data;
};

const createOrganization = async (name: string) => {
  console.log("Name of the org ", name);
  const res = await api.post("/api/org", { name });
  return res.data;
};

const joinOrganization = async (
  code: string,
): Promise<{ message: string; slug: string }> => {
  const res = await api.post("/api/org/join", { code });
  return res.data;
};

export function useGetOrganizations() {
  return useQuery({
    queryKey: ["organizations"],
    queryFn: getOrganizations,
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name: string) => createOrganization(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      toast.success("Organization created!");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to create organization",
      );
    },
  });
}

export function useJoinOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (code: string) => joinOrganization(code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      toast.success("Joined organization!");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to join organization",
      );
    },
  });
}
