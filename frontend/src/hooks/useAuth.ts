import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";


const authKeys = {
  all : ["auth"] as const,
  user : () => [...authKeys.all, "user"] as const
}

const registerUser = async (data: any) => {
  const res = await api.post("/api/auth/register", data);
  return res.data;
};

const loginUser = async (data: any) => {
  const res = await api.post("/api/auth/login", data);
  return res.data;
};

const logoutUser = async () => {
  const res = await api.post("/api/auth/logout")
  return res.data
}

const getCurrentUser = async () => {
  const res = await api.get("/api/auth/me");
  return res.data;
};

export function useRegisterUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.all });
      toast.success("User Registered successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create user");
    },
  });
}

export function useLoginUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.all });
      toast.success("User Logged in successfully");
    },
  });
}
export function useLogoutUser(){
  const queryClient = useQueryClient()
  const router = useRouter()
  
  return useMutation({
    mutationFn : logoutUser,
    onSuccess : () => {
      // queryClient.invalidateQueries({queryKey :  ["auth"]})
      queryClient.clear()
      toast.success("User Logout Successfully")
      router.push("/login")
    }
  })
}

export function useGetCurrentUser() {
  return useQuery({
    queryFn: getCurrentUser,
    queryKey: authKeys.user(),
    staleTime : 1000 * 60 * 60,
    retry : false
  });
}

