"use client";
import { useSearchParams } from "next/navigation";
import { useGithubRepos } from "@/hooks/github";
import React, { useState } from "react"; // Added useState import
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Page = () => {
  const [selectedRepo, setSelectedRepo] = useState(""); // Added state for selected repo

  const {
    data: repos,
    isLoading,
    error,
    forceRefresh,
    isRefreshing,
    getRateLimitInfo,
  } = useGithubRepos();
  const searchParams = useSearchParams();
  const channelId = searchParams.get("channelId");

  if (isLoading) {
    return <div>Loading repositories...</div>;
  }

  if (error) {
    return <div>Error loading repositories: {error.message}</div>;
  }

  // Find the selected repository object based on the selected ID
  const selectedRepository = repos?.find(
    (repo) => repo.id.toString() === selectedRepo,
  );

  return (
    <div className="p-4">
      <Select value={selectedRepo} onValueChange={setSelectedRepo}>
        <SelectTrigger className="w-[280px] border border-white/10">
          <SelectValue placeholder="Select a repository" />
        </SelectTrigger>
        <SelectContent>
          {repos?.map((repo) => (
            <SelectItem key={repo.id} value={repo.id.toString()}>
              {repo.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Display selected repository details */}
      {selectedRepository && (
        <div className="mt-4 space-y-2">
          {JSON.stringify(selectedRepository, null, 2)}
        </div>
      )}

      <div className="mt-4">channelId: {channelId}</div>
    </div>
  );
};

export default Page;
