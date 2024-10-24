"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { loginWithGithub } from "@/lib/auth";

import { Github } from "lucide-react";
export default function SignUpPage() {
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  useEffect(() => {
    if (error) {
      setErrorMessage(decodeURIComponent(error));
    }
  }, [error]);

  return (
    <div className="flex min-h-full items-center justify-center">
      <div className="flex w-full max-w-md flex-col rounded-lg border-[1.5px] border-tertiary bg-secondary px-4 pb-8 pt-4 shadow-md">
        {errorMessage && (
          <div className="mb-4 rounded-lg bg-red-100 p-4 text-sm text-red-700 dark:bg-red-200 dark:text-red-800">
            {errorMessage}
          </div>
        )}

        <span className="w-full items-center justify-center text-center text-xl font-semibold text-gray-300">
          Sign in to GitKnit
        </span>
        <form action={loginWithGithub} className=" ">
          <button
            type="submit"
            className="mt-4 w-full rounded-md border-[1.5px] border-tertiary bg-foreground py-2 text-lg font-medium text-white transition-colors hover:border-accent/50 hover:bg-foreground/80 focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <Github size={24} className="mr-2 inline-block text-accent" />
            Sign up with GitHub
          </button>
        </form>
      </div>
    </div>
  );
}
