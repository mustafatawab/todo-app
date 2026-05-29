import LogoutButton from "@/components/LogoutButton";
import Task from "@/components/Task";
import TaskList from "@/components/TaskList";
// import { auth } from "@/lib/auth";
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
  // const session = await auth.api.getSession({ headers: await headers() });
  // if (!session) {
  //   redirect("/login");
  // }

  
  const session = {
    user : {
      id : "001",
      name: "John Smith",
      email: "john@abc.com"
    }
  }


  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <header className="relative flex justify-between items-end mb-16 pb-6 border-b border-primary/20 animate-in fade-in slide-in-from-top-2 duration-500">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 bg-primary animate-pulse" />
              <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-primary uppercase">
                System Online
              </span>
            </div>
            <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none">
              Command <span className="text-primary/80">Center</span>
            </h1>
            <p className="text-muted-foreground text-xs font-mono uppercase tracking-widest opacity-60">
              Orbital Task Management Protocol v1.0
            </p>
          </div>

          <div className="flex items-center gap-6">
            <AddTask userId={session.user.id} />
            <div className="flex items-center gap-3 pl-6 border-l border-border/40">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] font-mono font-bold uppercase tracking-tight leading-none mb-1">
                  Operator
                </p>
                <p className="text-xs font-medium opacity-80">
                  {session.user.name}
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger className="focus:outline-none group">
                  <div className="relative">
                    <Avatar className="h-10 w-10 rounded-none border border-primary/30 group-hover:border-primary transition-all duration-300">
                      <AvatarFallback className="bg-secondary text-primary font-mono text-xs rounded-none">
                        {session.user.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-background border border-primary/30 flex items-center justify-center">
                      <div className="w-1 h-1 bg-primary" />
                    </div>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-64 p-0 rounded-none border border-primary/20 bg-background/95 backdrop-blur-xl shadow-2xl shadow-primary/5"
                >
                  <div className="p-4 border-b border-border/40 bg-secondary/20">
                    <p className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-primary/60 mb-2">
                      Security ID
                    </p>
                    <p className="text-sm font-bold truncate tracking-tight">
                      {session.user.name}
                    </p>
                    <p className="text-[10px] font-mono text-muted-foreground truncate mt-1">
                      {session.user.email}
                    </p>
                  </div>
                  <div className="p-2">
                    <LogoutButton />
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <main className="animate-in fade-in slide-in-from-bottom-2 duration-700 delay-150">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-px w-8 bg-primary/40" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] opacity-50">
                Active Protocols
              </span>
            </div>
          </div>
          <TaskList userId={session.user.id} />
        </main>
      </div>
    </div>
  );
}
