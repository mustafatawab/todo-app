import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useOrg } from "@/context/orgContext";
import toast from "react-hot-toast";
import type { Member } from "@/types";

const getMembers = async (slug: string): Promise<Member[]> => {
  const res = await api.get(`/api/org/${slug}/members`);
  return res.data;
};

const addMember = async ({ slug, data }: { slug: string; data: { name: string; username: string; email: string; password: string } }) => {
  const res = await api.post(`/api/org/${slug}/members`, data);
  return res.data;
};

const removeMember = async ({ slug, userId }: { slug: string; userId: string }) => {
  const res = await api.delete(`/api/org/${slug}/members/${userId}`);
  return res.data;
};

const changeMemberRole = async ({ slug, userId, role }: { slug: string; userId: string; role: "ADMIN" | "MEMBER" }) => {
  const res = await api.patch(`/api/org/${slug}/members/${userId}/role`, { role });
  return res.data;
};

export function useGetMembers() {
  const { currentOrg } = useOrg();
  const slug = currentOrg?.slug;

  return useQuery({
    queryKey: ["members", slug],
    queryFn: () => getMembers(slug!),
    enabled: !!slug,
  });
}

export function useAddMember() {
  const queryClient = useQueryClient();
  const { currentOrg } = useOrg();
  const slug = currentOrg?.slug!;

  return useMutation({
    mutationFn: (data: { name: string; username: string; email: string; password: string }) => addMember({ slug, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members", slug] });
      toast.success("Member added successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to add member");
    },
  });
}

export function useRemoveMember() {
  const queryClient = useQueryClient();
  const { currentOrg } = useOrg();
  const slug = currentOrg?.slug!;

  return useMutation({
    mutationFn: (userId: string) => removeMember({ slug, userId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members", slug] });
      toast.success("Member removed");
    },
    onError: () => {
      toast.error("Failed to remove member");
    },
  });
}

export function useChangeMemberRole() {
  const queryClient = useQueryClient();
  const { currentOrg } = useOrg();
  const slug = currentOrg?.slug!;

  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: "ADMIN" | "MEMBER" }) => changeMemberRole({ slug, userId, role }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["members", slug] });
      toast.success(variables.role === "ADMIN" ? "Member promoted to admin" : "Member demoted to member");
    },
    onError: () => {
      toast.error("Failed to update role");
    },
  });
}
