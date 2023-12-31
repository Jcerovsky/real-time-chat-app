"use client";

import React, { useContext, useState } from "react";
import Input from "@/app/components/Input";
import Button from "@/app/components/Button";
import Link from "next/link";
import Image from "next/image";
import useObjectState from "@/app/hooks/useObjectState";
import { FormProps } from "@/app/signup/page";
import { usePathname, useRouter } from "next/navigation";
import ErrorMessage from "@/app/components/ErrorMessage";
import { Context } from "@/app/context/Context";
function Page() {
  const [formData, setFormData] = useObjectState<FormProps>({
    password: "",
    username: "",
  });
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

  const path = usePathname();
  const router = useRouter();

  const { setState } = useContext(Context)!;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await fetch(`/api/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Custom-Referer": path },
      body: JSON.stringify(formData),
    });
    if (!res.ok) {
      const responseBody = await res.json();
      setState({ errorMessage: responseBody.error });
    } else {
      setIsSubmitted(true);
      router.push("/");
      setState({
        currentUser: formData.username,
        errorMessage: "",
        isAuthenticated: true,
      });
    }
  };

  return (
    <form
      className="w-full sm:w-3/4 sm:ml-auto sm:mr-auto px-6 py-10 rounded-md bg-white dark:bg-primary-dark
    max-w-[38rem] sm:mt-10 dark:text-zinc-50 shadow-large "
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
        value={formData.username.trim()}
        name="username"
        setFormData={setFormData}
      />
      <div className="relative">
        <Input
          placeholder="Password "
          value={formData.password.trim()}
          name="password"
          setFormData={setFormData}
          type={isPasswordVisible ? "text" : "password"}
        />
        <Image
          className="absolute top-4 right-6 cursor-pointer"
          onMouseDown={() => setIsPasswordVisible(true)}
          onMouseUp={() => setIsPasswordVisible(false)}
          width={24}
          height={24}
          src={`/assets/${isPasswordVisible ? "crossed-" : ""}eye-icon.png`}
          alt="eye-icon"
        />
      </div>
      <Button customStyle="mt-5 w-full py-3 px-4" isDisabled={isSubmitted}>
        Log in
      </Button>
      <div className=" mt-5 flex ">
        <p className="opacity-40">{"Don't have an account?"}</p>
        <span className="ml-1 hover:text-blue-800 dark:hover:text-blue-300 hover:underline ">
          <Link href={"/signup"}>Sign up</Link>
        </span>
      </div>
    </form>
  );
}

export default Page;
