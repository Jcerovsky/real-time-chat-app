"use client";

import React from "react";
import Input from "@/app/components/Input";
import Button from "@/app/components/Button";
import Link from "next/link";
import useObjectState from "@/app/hooks/useObjectState";

export interface FormProps {
  username: string;
  password: string;
  confirmPassword?: string;
}

function Page() {
  const [formData, setFormData] = useObjectState<FormProps>({
    username: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await fetch("../api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.status === 409) {
      console.log("user already exists");
    } else {
      setFormData({ username: "", password: "", confirmPassword: "" });
      console.log("user signed up");
    }
  };

  return (
    <form
      className="w-full sm:w-3/4 sm:ml-auto sm:mr-auto px-6 py-10 rounded-md bg-white dark:bg-primary-dark
    max-w-[38rem]"
      onSubmit={handleSubmit}
    >
      <h1 className="text-2xl text-center mb-5">Create Account</h1>
      <Input
        placeholder="Username"
        value={formData.username}
        setFormData={setFormData}
        name={"username"}
      />
      <Input
        placeholder="Password"
        value={formData.password}
        setFormData={setFormData}
        name="password"
      />
      <Input
        placeholder="Confirm your password"
        name="confirmPassword"
        value={formData.confirmPassword!}
        setFormData={setFormData}
      />
      <Button style="mt-5">Sign up</Button>
      <div className=" mt-5 flex ">
        <p className="opacity-40">{"Already have an account?"}</p>
        <span className="ml-1 hover:text-blue-800 hover:underline ">
          <Link href={"/login"}>Log in</Link>
        </span>
      </div>
    </form>
  );
}

export default Page;
