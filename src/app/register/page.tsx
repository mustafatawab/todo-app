"use client";
import React, { useEffect, useState } from "react";
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
import { useFormState, useFormStatus } from "react-dom";
import { useRef } from "react";
import { useActionState } from "react";
import { register } from "@/action/auth-action";
import { useRouter } from "next/navigation";

const page = () => {
  const ref = useRef<HTMLFormElement>(null);
  const router = useRouter()
  const [showPass, setShowPass] = useState<boolean>(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });

    console.log(form);
  };

  const onCheckboxChange = (e: any) => {
    setShowPass(e.target.checked);
    console.log(showPass);
  };

  const signUpEmail = async (e: any) => {
    const { name, email, password, confirm_password } = form;
    e.preventDefault();
    if (password !== confirm_password) {
      toast.error("Password do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    const res = await register(name, email, password);
    if (res.user) {
      toast.success("Registered Successfully");
      ref.current?.reset();
      router.push("/")
      setForm({
        name: "",
        email: "",
        password: "",
        confirm_password: "",
      });
    }
  };

  return (
    <main className="px-5 w-full min-h-screen flex items-center justify-center">
      <Card className="w-full md:w-1/2 lg:w-1/3 space-y-4 bg-white p-5 border-0">
        <h2 className="text-center text-3xl font-bold mb-5">Register</h2>

        <CardContent>
          <form
            ref={ref}
            onSubmit={signUpEmail}
            className="flex flex-col gap-5"
          >
            <div className="space-y-2">
              <Label htmlFor="name" className="text-lg">
                Full Name
              </Label>
              <Input
                name="name"
                value={form.name}
                onChange={handleChange}
                id="name"
                type="text"
                placeholder="Full Name"
                className="focus:bg-slate-100 focus:border-none"
                required
              />
            </div>

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
                type="password"
                placeholder="Password"
                className="focus:bg-slate-100 focus:border-none"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm_password" className="text-lg">
                Confirm Password
              </Label>
              <Input
                name="confirm_password"
                value={form.confirm_password}
                onChange={handleChange}
                id="confirm_password"
                type="password"
                placeholder="Confirm Password"
                className="focus:bg-slate-100 focus:border-none"
                required
              />
            </div>
            <div className="flex items-start gap-3">
              <Checkbox
                id="toggle"
                onChange={onCheckboxChange}
                checked={showPass}
              />
              <Label htmlFor="toggle">Show Password</Label>
            </div>

            <Button
              type="submit"
              className="bg-slate-800 hover:bg-slate-700 cursor-pointer"
            >
              Sign Up
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <p className="text-center">
            Already have an account ?{" "}
            <Link href={"/login"} className="cursor-pointer text-blue-700 ">
              Login{" "}
            </Link>{" "}
          </p>
          <span>OR</span>
          <Button variant="outline" className="w-full">
            Sign Up with Google
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
};

export default page;
