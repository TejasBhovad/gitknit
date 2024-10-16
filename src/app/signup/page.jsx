"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createAccount, loginWithEmail } from "@/db/auth";
import { signUpWithGithub } from "@/lib/server/oauth";
import { getLoggedInUser } from "@/lib/server/appwrite";
import { redirect } from "next/navigation";

export default function SignUpPage() {
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getLoggedInUser();
      if (user) {
        setUser(user);
        redirect("/account");
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
      await loginWithEmail(formData);
    }
  };

  return (
    <>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <form onSubmit={(e) => handleSubmit(e, "createAccount")}>
        <input id="email" name="email" placeholder="Email" type="email" />
        <input
          id="password"
          name="password"
          placeholder="Password"
          minLength={8}
          type="password"
        />
        <input id="name" name="name" placeholder="Name" type="text" />
        <button type="submit">Sign up</button>
      </form>
      <form onSubmit={(e) => handleSubmit(e, "loginWithEmail")}>
        <input id="login-email" name="email" placeholder="Email" type="email" />
        <input
          id="login-password"
          name="password"
          placeholder="Password"
          minLength={8}
          type="password"
        />
        <button type="submit">Log in</button>
      </form>
      <form action={signUpWithGithub}>
        <button type="submit">Sign up with GitHub</button>
      </form>
    </>
  );
}
