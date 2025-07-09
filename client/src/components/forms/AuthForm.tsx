"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Form } from "../ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormField from "./FormField";
import { Button } from "../ui/button";
import Link from "next/link";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(3),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter();
  const isSignIn = type === "sign-in";
  const formSchema = authFormSchema(type);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const res = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (res && res.ok && res.url) {
        router.push('/');
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function googleLogin() {
    signIn("google", {
      callbackUrl: "/",
      redirect: true,
    })
  }

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-4xl font-semibold">
        {isSignIn ? "Sign in" : "Sign Up"}
      </h1>
      <p className="text-lg">
        {isSignIn ? "Welcome Back!" : "Start creating an account!"}
      </p>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-4 mt-4"
        >
          {!isSignIn && (
            <FormField
              control={form.control}
              name="name"
              label="Username"
              placeholder="Your Username"
            />
          )}
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
            {isSignIn ? "Sign In" : "Create an Account"}
          </Button>
        </form>
      </Form>

      <div className="w-full flex gap-4 items-center justify-center">
        <div className="border w-40 my-4 rounded-full"></div>
        <p>OR</p>
        <div className="border w-40 my-4 rounded-full"></div>
      </div>
      <Button
        variant="outline"
        className="min-h-10 border rounded-2xl bg-transparent cursor-pointer"
        onClick={googleLogin}
      >
        <Image src="/google.webp" width={24} height={24} alt="google logo" />
        Sign in With Google
      </Button>

      <p className="mt-2">
        {isSignIn ? "No account yet?" : "Have an account already"}
        <Link
          href={!isSignIn ? "/sign-in" : "/sign-up"}
          className="font-semibold ml-1 text-[#8300EA] hover:underline"
        >
          {!isSignIn ? "Sign in" : "Sign up"}
        </Link>
      </p>
    </div>
  );
};

export default AuthForm;
