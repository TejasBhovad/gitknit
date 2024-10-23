"use client";
import React, { useEffect, useState } from "react";
import { fetchGithubRepos } from "@/lib/github";
import { Button } from "@/components/ui/button";
import { useGithubRepos } from "@/hooks/github";

const Page = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // const [repos, setRepos] = useState([]);
  const {
    data: repos,
    isLoading,
    error,
    forceRefresh,
    isRefreshing,
    getRateLimitInfo,
  } = useGithubRepos();

  useEffect(() => {
    const fetchUser = async () => {
      try {
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
      <span>{JSON.stringify(repos, null, 2)}</span>
    </div>
  );
};

export default Page;
