"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createAccount, loginWithEmail } from "@/db/auth";
import { signUpWithGithub } from "@/lib/server/oauth";
import { getLoggedInUser } from "@/lib/server/appwrite";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getLoggedInUser();
      if (user) {
        setUser(user);
        router.push("/account");
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (error) {
      setErrorMessage(decodeURIComponent(error));
    }
  }, [error]);

  const handleSubmit = async (event, action) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    if (action === "createAccount") {
      await createAccount(formData);
    } else if (action === "loginWithEmail") {
      const session = await loginWithEmail(formData);
      if (session) {
        router.push("/account");
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-md">
        {errorMessage && (
          <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800">
            {errorMessage}
          </div>
        )}
        <form
          onSubmit={(e) => handleSubmit(e, "createAccount")}
          className="space-y-4"
        >
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              className="w-full p-2 mt-1 bg-gray-700 border border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              minLength={8}
              className="w-full p-2 mt-1 bg-gray-700 border border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-300"
            >
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Name"
              className="w-full p-2 mt-1 bg-gray-700 border border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 mt-4 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Sign up
          </button>
        </form>
        <form
          onSubmit={(e) => handleSubmit(e, "loginWithEmail")}
          className="space-y-4"
        >
          <div>
            <label
              htmlFor="login-email"
              className="block text-sm font-medium text-gray-300"
            >
              Email
            </label>
            <input
              id="login-email"
              name="email"
              type="email"
              placeholder="Email"
              className="w-full p-2 mt-1 bg-gray-700 border border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label
              htmlFor="login-password"
              className="block text-sm font-medium text-gray-300"
            >
              Password
            </label>
            <input
              id="login-password"
              name="password"
              type="password"
              placeholder="Password"
              minLength={8}
              className="w-full p-2 mt-1 bg-gray-700 border border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 mt-4 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Log in
          </button>
        </form>
        <form action={signUpWithGithub} className="space-y-4">
          <button
            type="submit"
            className="w-full py-2 mt-4 text-sm font-medium text-white bg-gray-600 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Sign up with GitHub
          </button>
        </form>
      </div>
    </div>
  );
}
