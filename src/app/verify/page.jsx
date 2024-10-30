"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";

const Page = () => {
  const searchParams = useSearchParams();
  const [token, setToken] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const repoId = searchParams.get("repoId");
    setToken(repoId || "No token found");
  }, [searchParams]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="flex h-full items-center justify-center">
      <Card className="w-full max-w-md border-2 border-primary/10 bg-background shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-center text-2xl font-bold">
            Verify Channel
          </CardTitle>
          <CardDescription className="text-center">
            Use the /verify command in your channel to verify
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md bg-tertiary/50 px-2 py-2">
            <code className="rounded bg-black/50 p-2 font-mono text-sm">
              /verify
            </code>
            <span className="font-mono text-sm"> {token}</span>
          </div>
          <div className="flex items-center justify-between rounded-md border border-white/25 px-4 py-2">
            <code className="truncate font-mono text-sm">{token}</code>
            <Button
              variant="outline"
              size="sm"
              className="ml-2 shrink-0"
              onClick={copyToClipboard}
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              <span className="sr-only">Copy token</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
