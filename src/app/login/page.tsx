import React from "react";
import Input from "@/app/components/Input";
import Button from "@/app/components/Button";
import Link from "next/link";

function LoginPage() {
  return (
    <form
      className="w-full sm:w-3/4 sm:ml-auto sm:mr-auto px-6 py-10 rounded-md bg-white dark:bg-primary-dark
    max-w-[38rem]"
    >
      <h1 className="text-2xl text-center">
        Welcome to your favourite chat app!
      </h1>
      <p className="mb-5 opacity-50 text-sm text-center">
        Please log in or sign up below
      </p>
      <Input placeholder="Username" />
      <Input placeholder="Password " />
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

export default LoginPage;
