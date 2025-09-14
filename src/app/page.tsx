import LogoutButton from "@/components/LogoutButton";
import Task from "@/components/Task";
import TaskList from "@/components/TaskList";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import AddTask from "@/components/addTask";


export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="mt-10 container mx-auto px-4">
      <div className="flex justify-center items-center gap-10">
        <AddTask userId={session.user.id} />
        <LogoutButton />
      </div>

      <div className="flex flex-col justify-center items-center mt-10 text-2xl font-bold">
        <div>{session.user.name}</div>
        <div>{session.user.email}</div>
        <div>{session.user.id}</div>
      </div>

      <TaskList userId={session.user.id} />
    </div>
  );
}
