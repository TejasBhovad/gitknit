"use client";
import React, { useEffect, useState } from "react";
import { checkLoggedIn, loginWithGithub } from "@/db/auth";
import { Button } from "@/components/ui/button";
import { account } from "@/db/auth";
const Page = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const session = await account.getSession("current");
        const userData = await checkLoggedIn();
        console.log(session.provider);
        console.log(session.providerUid);
        console.log(session.providerAccessToken);
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6">
      {user ? (
        <>
          <h2 className="text-lg font-semibold">User Info:</h2>
          <pre>{JSON.stringify(user, null, 2)}</pre>
          <Button
            onClick={loginWithGithub}
            className="h-auto w-auto rounded-sm bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600"
          >
            Connect GitHub
          </Button>
        </>
      ) : (
        <div>
          <p>Please log in to view your user information.</p>
          <Button
            onClick={loginWithGithub}
            className="h-auto w-auto rounded-sm bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600"
          >
            Login with GitHub
          </Button>
        </div>
      )}
    </div>
  );
};

export default Page;
