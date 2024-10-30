import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Lock,
  Unlock,
  CheckCircle,
  XCircle,
  GitBranch,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";
export default function ProjectCard({ repo }) {
  return (
    <Link href={`/project/${repo.$id}`}>
      <Card className="w-full max-w-sm overflow-hidden border-tertiary bg-black/20 transition-all duration-300 hover:shadow-md">
        <CardContent className="p-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="mr-2 truncate text-lg font-semibold">{repo.name}</h3>
            <Badge
              variant={repo.isPrivate ? "secondary" : "outline"}
              className="text-xs"
            >
              {repo.isPrivate ? (
                <Lock className="mr-1 h-3 w-3" />
              ) : (
                <Unlock className="mr-1 h-3 w-3" />
              )}
              {repo.isPrivate ? "Private" : "Public"}
            </Badge>
          </div>
          <div className="mb-2 flex items-center text-sm text-muted-foreground">
            <span className="mr-2 flex items-center">
              <GitBranch className="mr-1 h-3 w-3" />
              <a href={repo.source} className="truncate text-blue-500">
                Source
              </a>
            </span>
            {repo.verified ? (
              <Badge variant="success" className="text-xs">
                <CheckCircle className="mr-1 h-3 w-3" />
                Verified
              </Badge>
            ) : (
              <Badge variant="destructive" className="text-xs">
                <XCircle className="mr-1 h-3 w-3" />
                Not verified
              </Badge>
            )}
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <span className="mr-4 flex items-center">
                <MessageCircle className="mr-1 h-3 w-3" />
                {repo.threads.length}
              </span>
              <span className="flex items-center">
                <svg
                  className="mr-1 h-3 w-3 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {repo.stars}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              Updated {repo.lastUpdated}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
