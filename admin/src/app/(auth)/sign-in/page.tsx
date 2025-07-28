"use client";

import React from "react";
import FormField from "@/components/FormField";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { setIsLoggedIn } from "@/store/features/authSlice";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const authFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .regex(/[A-Z]/, {
      message: "Must contain at least one uppercase character",
    })
    .regex(/[0-9]/, { message: "Must contain at least one number" })
    .regex(/[^A-Za-z0-9]/, { message: "Must contain at least one symbol" }),
});

const Page = () => {
  type AuthFormData = z.infer<typeof authFormSchema>;
  const dispatch = useDispatch();
  const router = useRouter();
  const form = useForm<AuthFormData>({
    resolver: zodResolver(authFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof authFormSchema>) {
    console.log(values);
    try {
      const res = await fetch("/api/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await res.json();
      console.log(data.success);
      if (data.success) {
        dispatch(setIsLoggedIn(true));
        toast.success("Signed in Successfully");
        router.push('/');
      } else {
        toast.error("Invalid credentials");
      }
    } catch (error) {
      console.error("Auth Error:", error);
      toast.error("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="flex flex-col gap-2 h-screen items-center mx-auto justify-center max-w-xs md:max-w-lg">
      <h1 className="text-4xl font-semibold">Admin Sign in</h1>
      <p className="text-lg">Welcome Back Admin!</p>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-4 mt-4"
        >
          <FormField
            control={form.control}
            name="email"
            label="Email"
            placeholder="Enter your Email"
            type="email"
          />
          <FormField
            control={form.control}
            name="password"
            label="Password"
            placeholder="Enter your Password"
            type="password"
          />
          <p className="my-2 cursor-pointer ml-1 text-[#8300EA] hover:underline">
            Forgot Password?
          </p>
          <Button
            type="submit"
            className="w-full min-h-10 bg-[#8300EA] mt-2 hover:bg-[#8300EA95] transition duration-300 cursor-pointer ease-in"
          >
            Sign In
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Page;
