"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { addRepository } from "@/db/repository";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { useGithubRepos } from "@/hooks/github";
import React, { useState } from "react";
import { AuthContext } from "@/context/auth";
import { useContext } from "react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Page = () => {
  const router = useRouter();
  const [selectedRepo, setSelectedRepo] = useState(""); // Added state for selected repo
  const { user, loading } = useContext(AuthContext);
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

  const selectedRepository = repos?.find(
    (repo) => repo.id.toString() === selectedRepo,
  );

  const handleCreateRepo = async () => {
    if (!selectedRepository) {
      return;
    }
    if (!channelId) {
      return;
    }
    if (!user) {
      console.log("User not found");
      return;
    }

    console.log("Creating repository...");
    console.log(selectedRepository);
    console.log(channelId);
    console.log(user.user.email);
    const repo = await addRepository({
      channel_id: channelId,
      email: user.user.email,
      name: selectedRepository.fullName,
      is_private: selectedRepository.isPrivate,
      source: selectedRepository.url,
    });
    console.log("Repository created:", repo);
    const repoId = repo["$id"];
    router.push(`/verify?repoId=${repoId}`);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex h-full w-full max-w-6xl flex-col items-center p-4">
        <Card className="my-4 w-2/3 max-w-xl border border-tertiary bg-background">
          <CardHeader>
            <CardTitle>Select repository</CardTitle>
            <CardDescription>
              This repository be linked with your discord channel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedRepo} onValueChange={setSelectedRepo}>
              <SelectTrigger className="max-w-[280px] border border-white/10">
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
          </CardContent>
          <CardFooter>
            <Button
              className="w-fit bg-accent font-semibold text-white hover:bg-accent/80"
              onClick={handleCreateRepo}
            >
              Continue
            </Button>
          </CardFooter>
        </Card>

        {/* Display selected repository details */}
        {/* {selectedRepository && (
          <div className="mt-4 space-y-2">
            {JSON.stringify(selectedRepository, null, 2)}
          </div>
        )}

        <div className="mt-4">channelId: {channelId}</div> */}
      </div>
    </div>
  );
};

export default Page;
