"use client";
import React, { useEffect, useState } from "react";
import { checkLoggedIn } from "@/lib/auth";

const Page = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await checkLoggedIn();
      setUser(userData);
      setLoading(false);
    };

    fetchUser();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Account</h1>
      {user ? (
        <p>Username: {JSON.stringify(user)}</p>
      ) : (
        <p>User not logged in</p>
      )}
    </div>
  );
};

export default Page;
