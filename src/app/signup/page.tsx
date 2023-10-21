"use client";

import React, { useContext } from "react";
import Input from "@/app/components/Input";
import Button from "@/app/components/Button";
import Link from "next/link";
import useObjectState from "@/app/hooks/useObjectState";
import { usePathname, useRouter } from "next/navigation";
import { Context } from "@/app/context/Context";
import ErrorMessage from "@/app/components/ErrorMessage";
import { comparePassword } from "@/app/utils/comparePassword";
import Success from "@/app/components/Success";

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      comparePassword(formData.password, formData.confirmPassword!) ===
      "Success"
    ) {
      setState({ errorMessage: "" });
      const updatedFormData = {
        ...formData,
        username: formData.username.toLowerCase(),
        password: formData.password,
      };

      const res = await fetch("../api/chat", {
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
    max-w-[38rem]"
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
