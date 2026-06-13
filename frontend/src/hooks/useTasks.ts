import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useOrg } from "@/context/orgContext";
import toast from "react-hot-toast";

const getTasks = async (slug: string) => {
  const res = await api.get(`/api/org/${slug}/tasks`);
  return res.data;
};

const createTask = async ({ data }: {  data: any }) => {
  const res = await api.post(`/api/org/tasks`, data);
  return res.data;
};

const updateTask = async ({ slug, data }: { slug: string; data: any }) => {
  const { id, ...rest } = data;
  const res = await api.put(`/api/org/${slug}/tasks/${id}`, rest);
  return res.data;
};

const deleteTask = async ({ slug, id }: { slug: string; id: string }) => {
  const res = await api.delete(`/api/org/${slug}/tasks/${id}`);
  return res.data;
};

const updateTaskStatus = async ({ slug, data }: { slug: string; data: any }) => {
  const { id, status } = data;
  const res = await api.patch(`/api/org/${slug}/tasks/${id}/status`, { status });
  return res.data;
};

export function useGetTasks() {
  const { currentOrg } = useOrg();
  const slug = currentOrg?.slug;

  return useQuery({
    queryKey: ["tasks", slug],
    queryFn: () => getTasks(slug!),
    enabled: !!slug,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  const { currentOrg } = useOrg();
  const slug = currentOrg?.slug!;

  return useMutation({
    mutationFn: (data: any) => createTask({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", slug] });
      toast.success("Task created");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create task");
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  const { currentOrg } = useOrg();
  const slug = currentOrg?.slug!;

  return useMutation({
    mutationFn: (data: any) => updateTask({ slug, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", slug] });
      toast.success("Task updated");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update task");
    },
  });
}

export function useCompleteTask() {
  const queryClient = useQueryClient();
  const { currentOrg } = useOrg();
  const slug = currentOrg?.slug!;

  return useMutation({
    mutationFn: (data: any) => updateTaskStatus({ slug, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", slug] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update task");
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  const { currentOrg } = useOrg();
  const slug = currentOrg?.slug!;

  return useMutation({
    mutationFn: ({ id }: { id: string }) => deleteTask({ slug, id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", slug] });
      toast.success("Task deleted");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete task");
    },
  });
}
