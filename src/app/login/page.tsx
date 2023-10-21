"use client";

import React, { useContext } from "react";
import Input from "@/app/components/Input";
import Button from "@/app/components/Button";
import Link from "next/link";
import useObjectState from "@/app/hooks/useObjectState";
import { FormProps } from "@/app/signup/page";
import { usePathname, useRouter } from "next/navigation";
import ErrorMessage from "@/app/components/ErrorMessage";
import { Context } from "@/app/context/Context";

function Page() {
  const [formData, setFormData] = useObjectState<FormProps>({
    username: "",
    password: "",
  });

  const path = usePathname();
  const router = useRouter();

  const { setState } = useContext(Context)!;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await fetch("../api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Custom-Referer": path },
      body: JSON.stringify(formData),
    });
    if (!res.ok) {
      const responseBody = await res.json();
      setState({ errorMessage: responseBody.error });
    } else {
      router.push("/");
      setState({ errorMessage: "", isAuthenticated: true });
    }
  };

  return (
    <form
      className="w-full sm:w-3/4 sm:ml-auto sm:mr-auto px-6 py-10 rounded-md bg-white dark:bg-primary-dark
    max-w-[38rem]"
      onSubmit={handleSubmit}
    >
      <h1 className="text-2xl text-center">
        Welcome to your favourite chat app!
      </h1>
      <div className="my-4">
        <ErrorMessage />
      </div>
      <p className="mb-5 opacity-50 text-sm text-center">
        Please log in with your username and password
      </p>
      <Input
        placeholder="Username"
        value={formData.username}
        name="username"
        setFormData={setFormData}
      />
      <Input
        placeholder="Password "
        value={formData.password}
        name="password"
        setFormData={setFormData}
      />
      <Button style="mt-5">Log in</Button>
      <div className=" mt-5 flex ">
        <p className="opacity-40">{"Don't have an account?"}</p>
        <span className="ml-1 hover:text-blue-800 hover:underline ">
          <Link href={"/signup"}>Sign up</Link>
        </span>
      </div>
    </form>
  );
}

export default Page;
