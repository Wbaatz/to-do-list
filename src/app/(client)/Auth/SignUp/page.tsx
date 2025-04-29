"use client";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import signupFormSchema from "@/schemas/authentication/signup";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import toast from "react-hot-toast";
import Image from "next/image";
import { useRouter } from "next/navigation";

const SignUp = () => {
  const formMethods = useForm<z.infer<typeof signupFormSchema>>({
    resolver: zodResolver(signupFormSchema),
  });
  const router = useRouter();
  // Handle form submission
  const onSubmit = async (data: any) => {
    const signup = {
      email: data.email,
      username: data.username,
      password: data.password,
    };
    try {
      const res = await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signup),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        setTimeout(() => {
          router.push("/Auth/SignIn");
        }, 2000);
      } else {
        toast.error(data.message || "An error occured");
      }
    } catch (error) {
      console.log(error);
    }
  };
 
  return (
    <div>
      <div className="text-center mb-4">
        <span className="text-5xl text-center">SIGN UP</span>
      </div>
      <Form {...formMethods}>
        <form
          onSubmit={formMethods.handleSubmit(onSubmit)}
          className="space-y-3  md:space-y-8"
        >
          <FormField
            control={formMethods.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input className=""
                    type="email"
                    placeholder="youremail@domain.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={formMethods.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input className="text-xs  md:text-base" placeholder="Muhammad" {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={formMethods.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input className="text-xs  md:text-base" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col gap-2">
            <Button className="text-white font-bold bg-black uppercase text-xs  md:text-base" type="submit">Signup To-DO-LIST</Button>
            <div className="my-1 md:my-8">
            <span className="my-4">
              Already had an account?{" "}
              <Link className="font-semibold" href={"/Auth/SignIn"}>
                Signin
              </Link>{" "}
            </span>
            </div>
           
          </div>
        </form>
      </Form>
    </div>
  );
};

export default SignUp;
