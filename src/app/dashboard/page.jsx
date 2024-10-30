"use client";
import { useFetchRepositories } from "@/hooks/repository";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "@/context/auth";
import ProjectCard from "../components/project-card";
const Page = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [isMounted, setIsMounted] = useState(false);
  const [email, setEmail] = useState("");
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    if (!user) return;
    setEmail(user.user.email);
    console.log("User email:", user.user.email);
  }, [user, isMounted]);

  const { data: repositories, isLoading, error } = useFetchRepositories(email);
  return (
    <div className="container mx-auto flex max-w-6xl flex-col gap-4 p-6">
      <h1 className="text-3xl font-bold">Projects</h1>
      <section>
        {isLoading && <div>Loading repositories...</div>}
        <div className="grid h-full w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {repositories &&
            repositories.map((repo) => (
              <ProjectCard key={repo.$id} repo={repo} />
            ))}
        </div>
      </section>
    </div>
  );
};

export default Page;
