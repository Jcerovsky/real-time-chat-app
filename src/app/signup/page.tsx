"use client";

import React, { useContext, useState } from "react";
import Input from "@/app/components/Input";
import Button from "@/app/components/Button";
import Link from "next/link";
import useObjectState from "@/app/hooks/useObjectState";
import { usePathname, useRouter } from "next/navigation";
import { Context } from "@/app/context/Context";
import ErrorMessage from "@/app/components/ErrorMessage";
import { comparePassword } from "@/app/utils/comparePassword";
import Success from "@/app/components/Success";
import Image from "next/image";

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

  const path = usePathname();
  const router = useRouter();
  const { setState } = useContext(Context)!;
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isPasswordVisible1, setIsPasswordVisible1] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitted(true);
    if (
      comparePassword(formData.password, formData.confirmPassword!) ===
      "Success"
    ) {
      setState({ errorMessage: "" });
      const updatedFormData = {
        ...formData,
        username: formData.username.toLowerCase().trim(),
        password: formData.password.trim(),
      };

      const API_URL = process.env.API_URL || "http://localhost:3000";

      const res = await fetch(`${API_URL}/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Custom-Referer": path,
        },
        body: JSON.stringify(updatedFormData),
      });

      const responseBody = await res.json();
      if (res.status === 409) {
        setState({ errorMessage: responseBody.error });
      } else {
        setState({
          successMessage:
            "Sign up successful, please log in with your username and password",
        });
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setState({ successMessage: "" });
        router.push("/");
        setFormData({ username: "", password: "", confirmPassword: "" });
      }
    } else {
      setState({
        errorMessage: comparePassword(
          formData.password,
          formData.confirmPassword!,
        ),
      });
    }
  };

  return (
    <form
      className="w-full sm:w-3/4 sm:ml-auto sm:mr-auto px-6 py-10 rounded-md bg-white dark:bg-primary-dark
    max-w-[38rem] sm:mt-10 dark:bg-primary-dark dark:text-zinc-50 shadow-large"
      onSubmit={handleSubmit}
    >
      <h1 className="text-2xl text-center mb-5">Create Account</h1>
      <ErrorMessage />
      <Success />
      <Input
        placeholder="Username"
        value={formData.username}
        setFormData={setFormData}
        name={"username"}
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
      <div className="relative ">
        <Input
          placeholder="Confirm your password"
          name="confirmPassword"
          value={formData.confirmPassword!}
          setFormData={setFormData}
          type={isPasswordVisible1 ? "text" : "password"}
        />
        <Image
          className="absolute top-4 right-6 cursor-pointer"
          onMouseDown={() => setIsPasswordVisible1(true)}
          onMouseUp={() => setIsPasswordVisible1(false)}
          width={24}
          height={24}
          src={`/assets/${isPasswordVisible1 ? "crossed-" : ""}eye-icon.png`}
          alt="eye-icon"
        />
      </div>
      <Button customStyle="mt-5 w-full py-3 px-4" isDisabled={isSubmitted}>
        Sign up
      </Button>
      <div className=" mt-5 flex ">
        <p className="opacity-40">{"Already have an account?"}</p>
        <span className="ml-1 hover:text-blue-800 dark:hover:text-blue-300 hover:underline ">
          <Link href={"/login"}>Log in</Link>
        </span>
      </div>
    </form>
  );
}

export default Page;
