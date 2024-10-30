"use client";
import Link from "next/link";
import { Loader } from "lucide-react";
import React, { useContext } from "react";
import Image from "next/image";
import { AuthContext } from "@/context/auth";

const Navbar = () => {
  const { user, loading } = useContext(AuthContext);

  const initials =
    user && user.user.name
      ? user.user.name
          .split(" ")
          .map((name) => name[0])
          .join("")
      : "";

  return (
    <div className="text-accen15 absolute flex h-14 w-full items-center justify-between border-b-[1.5px] border-white/15 px-4">
      <Link
        href="/"
        type="button"
        className="flex h-auto items-center justify-center gap-1 rounded border-[1.5px] border-accent/15 bg-secondary px-2 py-1 text-lg font-semibold"
      >
        <Image
          src="/gitknit.svg"
          alt="logo"
          width={48}
          height={48}
          className="aspect-square w-7"
        />
        GitKnit
      </Link>
      {loading ? (
        <div className="flex -translate-x-1 items-center gap-2">
          <Loader className="animate-spin" size={24} />
        </div>
      ) : user ? (
        <div className="flex h-full w-auto items-center gap-2">
          <Link
            href="/dashboard"
            className="flex h-2/3 w-fit items-center justify-center gap-4 rounded-sm bg-tertiary/50 px-4 py-1"
          >
            Dashboard
          </Link>

          <Link
            href="/account"
            className="flex aspect-square h-2/3 items-center justify-center gap-4 rounded-full bg-accent/25"
          >
            {initials}
          </Link>
        </div>
      ) : (
        <Link
          href="/signup"
          className="flex items-center gap-2 rounded border-[1.5px] border-accent/15 px-2 py-1 text-white"
        >
          Sign in
        </Link>
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
