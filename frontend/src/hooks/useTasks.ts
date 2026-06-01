import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

const createTask = async (data: any) => {
  const res = await api.post("/api/task", data);
  return res.data;
};

const getTasks = async () => {
  const res = await api.get(`/api/task`);
  return res.data;
};

//update task
const updateTask = async (data: any) => {
  const res = await api.put(`/api/task/${data.id}`, data);
  return res.data;
};

// complete task
const completeTask = async (id: string, data: any) => {
  const res = await api.patch(`/api/task/${id}/complete`, data);
  return res.data;
};

const deleteTask = async (id: string) => {
  const res = await api.delete(`/api/task/${id}`);
  return res.data;
};

export function useCreateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task created successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create task");
    },
  });
}

export function useGetTasks() {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update task");
    },
  });
}

export function useCompleteTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: completeTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task marked as completed");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to complete task");
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete task");
    },
  });
}
