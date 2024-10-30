"use client";
import { useFetchRepository } from "@/hooks/repository";
import React from "react";
import { GitFork, MessageCircle, Search, Star } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import { useParams } from "next/navigation";
import { useState } from "react";
const ProjectPage = () => {
  const { repoID } = useParams();
  const [selectedThread, setSelectedThread] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { data: repo, isLoading, error } = useFetchRepository(repoID);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const filteredMessages = selectedThread?.messages.filter((message) =>
    message.content.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <p className="text-muted-foreground">Loading repository...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <p className="text-destructive">Error loading repository</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <Card className="mx-auto max-w-4xl bg-black/50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold">
                {repo?.name || "Repository"}
              </span>
              <span className="text-sm text-muted-foreground">
                by {repo?.users?.name}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4" />
                <span className="text-sm">0</span>
              </div>
              <div className="flex items-center gap-1">
                <GitFork className="h-4 w-4" />
                <span className="text-sm">0</span>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {repo?.threads?.map((thread, index) => (
              <Button
                key={thread.$id}
                variant="outline"
                className="flex w-full items-center justify-between p-4 hover:bg-primary/5"
                onClick={() => setSelectedThread(thread)}
              >
                <div className="flex items-center gap-3">
                  <MessageCircle className="h-5 w-5 text-muted-foreground" />
                  <div className="flex w-full items-start justify-between gap-4">
                    <span>Thread {index + 1}</span>
                    <span className="text-sm text-muted-foreground">
                      {thread.messages.length} messages
                    </span>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">
                  {formatDate(thread.pushed_at)}
                </span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={!!selectedThread}
        onOpenChange={() => setSelectedThread(null)}
      >
        <DialogContent className="max-h-[80vh] max-w-2xl">
          <DialogHeader>
            <DialogTitle>Thread Messages</DialogTitle>
          </DialogHeader>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search messages..."
              className="border border-white/25 pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <ScrollArea className="h-[60vh]">
            <div className="space-y-1 pr-4">
              {filteredMessages?.map((message, index) => (
                <div key={index}>
                  <div className="flex gap-4 rounded-md bg-black/25 px-4 py-2">
                    <Avatar className="aspect-square h-full">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback>
                        {message.creator[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{message.creator}</span>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(message.$createdAt)}
                        </span>
                      </div>
                      <p className="text-sm">{message.content}</p>
                      {message.attachments.map((attachment, i) => (
                        <img
                          key={i}
                          src={attachment}
                          alt="Attachment"
                          className="mt-2 max-h-48 rounded-lg object-cover"
                        />
                      ))}
                    </div>
                  </div>
                  {index < filteredMessages.length - 1 && (
                    <Separator className="my-2 bg-tertiary" />
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default ProjectPage;
