"use client";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/auth";
import { addUserToDatabase, getUserByEmail } from "@/db/user";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, LogOut, User } from "lucide-react";
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
    <div className="container mx-auto max-w-2xl p-6">
      <Card className="overflow-hidden bg-black/25">
        <CardHeader className="bg-accent text-white">
          <CardTitle className="flex items-center text-lg font-bold">
            <User className="mr-2 h-5 w-5" />
            Account
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {user ? (
            <div className="space-y-4">
              <div className="rounded-lg bg-secondary p-4">
                <h2 className="mb-2 text-lg font-semibold">
                  Welcome, {user.user.name}
                </h2>
                <p className="text-muted-foreground">
                  Email: {user.user.email}
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex items-center text-green-600">
                  <CheckCircle className="mr-2 h-5 w-5" />
                  <span className="font-medium">You are logged in</span>
                </div>
                <Button
                  variant="destructive"
                  onClick={handleLogoutClick}
                  className="w-full bg-red-500/25 hover:bg-red-600/25 sm:w-auto"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
          ) : (
            <div className="rounded-lg bg-secondary p-4 text-center">
              <p className="text-muted-foreground">User not logged in</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
