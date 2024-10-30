"use client";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/auth";
import { addUserToDatabase, getUserByEmail } from "@/db/user";

const LoadingSpinner = () => (
  <div className="flex min-h-screen items-center justify-center">
    <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
  </div>
);

const CACHE_NAME = "user-auth-cache";
const CACHE_KEY = "/user-data";

const Page = () => {
  const [isMounted, setIsMounted] = useState(false);
  const { user, loading, handleLogout } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [isUserVerified, setIsUserVerified] = useState(false); // New state for user verification

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    if (!user) return;

    const fetchUserData = async () => {
      try {
        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(CACHE_KEY);

        if (cachedResponse) {
          const cachedData = await cachedResponse.json();
          console.log("User data retrieved from cache:", cachedData);
          setUserData(cachedData);
        } else {
          console.log("User data not found in cache, setting user data...");
          setUserData(user);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [user, isMounted, isUserVerified]);

  useEffect(() => {
    if (!isMounted) return;
    if (!userData || isUserVerified) return; // Skip if already verified

    const manageUserData = async () => {
      try {
        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(CACHE_KEY);

        let userDoc;
        if (cachedResponse) {
          userDoc = JSON.parse(await cachedResponse.text());
          console.log("Using cached user data:", userDoc);
          setIsUserVerified(true); // Mark as verified since we have valid cached data
        } else {
          userDoc = await getUserByEmail({ email: userData.user.email });
          if (!userDoc) {
            console.log("User does not exist in database, adding user...");
            await addUserToDatabase({
              name: userData.user.name,
              email: userData.user.email,
            });
            setIsUserVerified(true); // Mark as verified after adding
          } else {
            console.log("User exists in database:", userDoc);
            setIsUserVerified(true); // Mark as verified
          }
        }

        // Cache the user data
        await cache.put(CACHE_KEY, new Response(JSON.stringify(userData)));

        console.log("User data managed successfully");
      } catch (error) {
        console.error("Error managing user data:", error);
      }
    };

    manageUserData();
  }, [userData, isMounted, isUserVerified]); // Added isUserVerified here

  const handleLogoutClick = async () => {
    try {
      // Clear cache before logging out
      const cache = await caches.open(CACHE_NAME);
      await cache.delete(CACHE_KEY);
      handleLogout();
    } catch (error) {
      console.error("Error clearing cache:", error);
      handleLogout();
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <h1 className="mb-6 text-2xl font-bold">Account</h1>
      <div className="p-6">
        {user ? (
          <div className="space-y-4">
            <p>Welcome, {user.name}</p>
            <p>Email: {user.email}</p>
            <div className="flex flex-col gap-2">
              <p className="font-medium text-green-600">✓ You are logged in</p>
              <button
                onClick={handleLogoutClick}
                className="rounded bg-red-500 px-4 py-2 text-white transition-colors hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          <p>User not logged in</p>
        )}
      </div>
    </div>
  );
};

export default Page;
