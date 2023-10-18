import React from "react";
import Input from "@/app/components/Input";
import Button from "@/app/components/Button";
import Link from "next/link";
import useObjectState from "@/app/hooks/useObjectState";

function Page() {
  const [formData, setFormData] = useObjectState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  return (
    <form
      className="w-full sm:w-3/4 sm:ml-auto sm:mr-auto px-6 py-10 rounded-md bg-white dark:bg-primary-dark
    max-w-[38rem]"
    >
      <h1 className="text-2xl text-center mb-5">Create Account</h1>
      <Input placeholder="Username" />
      <Input placeholder="Password" />
      <Input placeholder="Confirm your password" />
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
