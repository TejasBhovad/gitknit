"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { checkLoggedIn } from "@/db/auth";
import Link from "next/link";
const Navbar = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const loggedInUser = await checkLoggedIn();
      if (!loggedInUser) {
        router.push("/signup");
      } else {
        setUser(loggedInUser);
      }
      setIsLoading(false);
    };
    fetchUser();
  }, [router]);

  const initials =
    user && user.name
      ? user.name
          .split(" ")
          .map((name) => name[0])
          .join("")
      : "";

  // const initials = "AB";
  return (
    <div className="absolute flex h-14 w-full items-center justify-between border-b-[1.5px] border-tertiary px-4 text-white">
      <Link
        href="/"
        type="button"
        className="flex h-auto items-center justify-center gap-1 rounded border-[1.5px] border-accent/15 bg-secondary px-2 py-1 text-lg font-semibold"
      >
        <Image
          src="./gitknit.svg"
          alt="logo"
          width={48}
          height={48}
          className="aspect-square w-7"
        />
        GitKnit
      </Link>
      {isLoading ? (
        <div className="flex items-center gap-2">
          <span>Loading...</span>
        </div>
      ) : user ? (
        <Link
          href="/account"
          className="flex aspect-square h-2/3 items-center justify-center gap-4 rounded-full bg-accent/25"
        >
          {initials}
        </Link>
      ) : (
        <button
          type="button"
          className="flex items-center gap-2 rounded border-[1.5px] border-accent/15 px-2 py-1"
        >
          Sign in
        </button>
      )}
    </div>
  );
};

const NavbarWrapper = ({ children }) => {
  return (
    <div className="flex h-screen w-full flex-col">
      <Navbar />
      <main className="w-full flex-grow pt-14">{children}</main>
    </div>
  );
};

export default NavbarWrapper;
