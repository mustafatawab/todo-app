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
import { login, socialLogin } from "@/action/auth-action";
import Image from "next/image";
import { FaGithub } from "react-icons/fa";
import { useRouter } from "next/router";
const page = () => {
  const [showPass, setShowPass] = useState<boolean>(false);
  const router = useRouter();
  const [form, setForm] = useState({
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
    const { email, password } = form;

    const res = await login(email, password);
    localStorage.removeItem("tasks");
    if (res.status == 200) {
      setForm({
        email: "",
        password: "",
      });
      toast.success(res.message);
      router.push("/");
    } else if (res.status == 401) {
      toast.error(res.message);
    } else if (res.status == 500) {
      toast.error(res.message);
    }
  };
  const socialSignIn = async (provider: "github" | "google") => {
    const res = await socialLogin(provider);
  };

  return (
    <main className="px-5 w-full min-h-screen flex flex-col items-center justify-center ">
      <Card className="w-full md:w-1/2 lg:w-1/3 space-y-4 bg-white p-5 border-0">
        <h2 className="text-center text-3xl font-bold mb-5">Login</h2>
        <CardContent>
          <form
            action=""
            onSubmit={signInEmail}
            className="flex flex-col gap-5"
          >
            <div className="space-y-2">
              <Label htmlFor="email" className="text-lg">
                Email
              </Label>
              <Input
                name="email"
                value={form.email}
                onChange={handleChange}
                id="email"
                type="email"
                placeholder="Email"
                className="focus:bg-slate-100 focus:border-none"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-lg">
                Password
              </Label>
              <Input
                name="password"
                value={form.password}
                onChange={handleChange}
                id="password"
                type={showPass ? "text" : "password"}
                placeholder="Password"
                className="focus:bg-slate-100 focus:border-none"
                required
              />
            </div>

            <div className="flex items-start gap-3">
              <Checkbox
                id="toggle"
                onCheckedChange={(checked) => setShowPass(!!checked)}
                checked={showPass}
              />
              <Label htmlFor="toggle">Show Password</Label>
            </div>

            <Button
              type="submit"
              className="bg-slate-800 hover:bg-slate-700 cursor-pointer"
            >
              Login
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <p className="text-center">
            Don't have an account ?{" "}
            <Link href={"/register"} className="cursor-pointer text-blue-700 ">
              Sign Up{" "}
            </Link>{" "}
          </p>
          <span>OR</span>
          <div className="flex flex-wrap md:flex-nowrap  justify-center items-center gap-2 w-3/4 md:w-1/2">
            <Button
              onClick={() => socialSignIn("google")}
              variant="outline"
              className="w-full"
            >
              <Image src={"/google.png"} alt="Google" width={20} height={20} />
            </Button>
            <Button
              onClick={() => socialLogin("github")}
              variant="outline"
              className="w-full"
            >
              <FaGithub className="w-[24px] h-[24px]" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </main>
  );
};

export default page;
