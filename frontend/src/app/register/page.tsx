"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import toast from "react-hot-toast";
// import { login, socialLogin } from "@/action/auth-action";
import Image from "next/image";
import { FaGithub } from "react-icons/fa";
import { useRouter } from "next/navigation";
const page = () => {
  const [showPass, setShowPass] = useState<boolean>(false);
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const onCheckboxChange = (e: any) => {
    setShowPass(e.target.checked);
  };

  const signInEmail = async (e: any) => {
    e.preventDefault();
    
    // const { email, password } = form;

    // const res = await login(email, password);
    // localStorage.removeItem("tasks");
    // if (res.status == 200) {
    //   setForm({
    //     email: "",
    //     password: "",
    //   });
    //   toast.success(res.message);
    //   router.push("/");
    // } else if (res.status == 401) {
    //   toast.error(res.message);
    // } else if (res.status == 500) {
    //   toast.error(res.message);
    // }
  };

  // const socialSignIn = async (provider: "github" | "google") => {
  //   const res = await socialLogin(provider);
  // };

  return (
    <main className="px-5 w-full min-h-screen flex flex-col items-center justify-center bg-background relative overflow-hidden">
      {/* Futurist Grid Background */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--primary) 1px, transparent 1px), linear-gradient(to bottom, var(--primary) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <Card className="w-full md:w-[480px] border border-primary/20 rounded-none shadow-2xl bg-background/40 backdrop-blur-3xl relative">
        {/* Tech Decor */}
        <div className="absolute top-0 left-0 w-12 h-px bg-primary/40" />
        <div className="absolute top-0 left-0 w-px h-12 bg-primary/40" />
        <div className="absolute bottom-0 right-0 w-12 h-px bg-primary/40" />
        <div className="absolute bottom-0 right-0 w-px h-12 bg-primary/40" />

        <CardHeader className="space-y-2 pb-10 pt-12 text-center border-b border-primary/10">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 border border-primary/30 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-primary animate-pulse" />
            </div>
          </div>
          <CardTitle className="text-2xl font-black uppercase tracking-[0.3em] text-foreground/90">
            Authentication
          </CardTitle>
          <CardDescription className="text-[10px] font-mono uppercase tracking-[0.2em] text-primary/60">
            Protocol: Secure Orbital Access v4.2
          </CardDescription>
        </CardHeader>

        <CardContent className="px-10 py-10">
          <form action="" onSubmit={signInEmail} className="space-y-8">
             <div className="space-y-3">
              <Label
                htmlFor="email"
                className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-primary ml-1"
              >
                Name
              </Label>
              <Input
                name="name"
                value={form.name}
                onChange={handleChange}
                id="name"
                type="text"
                placeholder="USER ORBIT"
                className="h-12 bg-primary/5 border-primary/20 focus:border-primary focus:bg-white transition-all duration-200 rounded-none px-4 font-mono text-sm"
                required
              />
            </div>
            
            <div className="space-y-3">
              <Label
                htmlFor="email"
                className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-primary ml-1"
              >
                Email
              </Label>
              <Input
                name="email"
                value={form.email}
                onChange={handleChange}
                id="email"
                type="email"
                placeholder="USER@STATION.ORBIT"
                className="h-12 bg-primary/5 border-primary/20 focus:border-primary focus:bg-white transition-all duration-200 rounded-none px-4 font-mono text-sm"
                required
              />
            </div>

            <div className="space-y-3">
              <Label
                htmlFor="password"
                className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-primary ml-1"
              >
                Password
              </Label>
              <Input
                name="password"
                value={form.password}
                onChange={handleChange}
                id="password"
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                className="h-12 bg-primary/5 border-primary/20 focus:border-primary focus:bg-white transition-all duration-200 rounded-none px-4 font-mono text-sm"
                required
              />
            </div>

            <div className="flex items-center space-x-3 ml-1">
              <Checkbox
                id="toggle"
                onCheckedChange={(checked) => setShowPass(!!checked)}
                checked={showPass}
                className="rounded-none border-primary/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <Label
                htmlFor="toggle"
                className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground cursor-pointer select-none opacity-60 hover:opacity-100 transition-opacity"
              >
                Reveal Key
              </Label>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-mono font-black uppercase tracking-[0.3em] rounded-none shadow-[0_0_30px_rgba(var(--primary),0.15)] transition-all duration-300 active:scale-[0.98]"
            >
              Initialize_Login
            </Button>
          </form>

          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full bg-primary/10" />
            </div>
            <div className="relative flex justify-center text-[9px] font-mono uppercase tracking-[0.2em]">
              <span className="bg-background px-4 text-primary/40">
                External_Bridges
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button
              
              variant="outline"
              className="h-12 border-primary/20 hover:bg-primary/5 rounded-none transition-all duration-300 group"
            >
              <Image
                src={"/google.png"}
                alt="Google"
                width={18}
                height={18}
                className="mr-3 opacity-40 group-hover:opacity-100 transition-opacity"
              />
              <span className="text-[10px] font-mono font-bold uppercase tracking-tighter">
                Google
              </span>
            </Button>
            <Button
              
              variant="outline"
              className="h-12 border-primary/20 hover:bg-primary/5 rounded-none transition-all duration-300 group"
            >
              <FaGithub className="w-4 h-4 mr-3 opacity-40 group-hover:opacity-100 transition-opacity" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-tighter">
                GitHub
              </span>
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 pb-12 pt-0 px-10">
          <div className="w-full h-px bg-primary/10 mb-6" />
          <p className="text-[10px] font-mono text-center text-muted-foreground uppercase tracking-widest">
            New operator?{" "}
            <Link
              href={"/register"}
              className="font-bold text-primary hover:underline underline-offset-4"
            >
              Register_ID
            </Link>{" "}
          </p>
        </CardFooter>
      </Card>
    </main>
  );
};

export default page;
