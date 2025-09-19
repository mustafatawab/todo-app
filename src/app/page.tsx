import LogoutButton from "@/components/LogoutButton";
import Task from "@/components/Task";
import TaskList from "@/components/TaskList";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import AddTask from "@/components/addTask";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="mt-10 container mx-auto px-4">
      <div className="flex max-w-6xl mx-auto justify-end items-center gap-5">
        <AddTask userId={session.user.id} />
        <div className="flex gap-5">
          <LogoutButton />
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar>
                <AvatarFallback className="bg-black text-white">
                  {session.user.name[0]}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-1">
              <DropdownMenuItem>{session.user.name}</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>{session.user.email}</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>{session.user.id}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <TaskList userId={session.user.id} />
    </div>
  );
}
