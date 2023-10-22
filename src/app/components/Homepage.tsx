"use client";

import React, { useContext, useEffect, useState } from "react";
import { Context } from "@/app/context/Context";
import { useRouter } from "next/navigation";
import Loading from "@/app/loading";
import Navbar from "@/app/components/Navbar";

function Homepage() {
  const router = useRouter();

  const { isAuthenticated } = useContext(Context)!;
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
    setIsLoading(false);
  }, [isAuthenticated]);

  if (isLoading) return <Loading />;

  return (
    <div className="bg-zinc-100 dark:bg-primary-dark">
      <h1>authenticated!</h1>
    </div>
  );
}

export default Homepage;
