"use client";
import React, { useEffect, useState } from "react";
import { useGithubRepos } from "@/hooks/github";

const Page = () => {
  const [loading, setLoading] = useState(true);

  const {
    data: repos,
    isLoading,
    error,
    forceRefresh,
    isRefreshing,
    getRateLimitInfo,
  } = useGithubRepos();

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
