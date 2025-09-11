import AddTaskDialog from "@/components/addTaskDialog";
import LogoutButton from "@/components/LogoutButton";
import Task from "@/components/Task";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const session  = await auth.api.getSession({headers : await headers()})
  if (!session){
    redirect('/login')
  }
  return (
    <div className="mt-10 container mx-auto px-4">
      <div className="flex justify-center items-center gap-10">

      <AddTaskDialog />
    <LogoutButton />
      </div>
      <Task />
    </div>
  );
}
