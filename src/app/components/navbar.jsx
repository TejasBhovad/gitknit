"use client";
import Link from "next/link";
import { Loader } from "lucide-react";
import React, { useContext } from "react";
// import Icon from "./icons/icon";
import { AuthContext } from "@/context/auth";

const Navbar = () => {
  const { user, loading } = useContext(AuthContext);

  const initials =
    user && user.name
      ? user.name
          .split(" ")
          .map((name) => name[0])
          .join("")
      : "";

  return (
    <div className="text-accen15 absolute flex h-14 w-full items-center justify-between border-b-[1.5px] border-white/15 px-4">
      <Link
        href="/"
        type="button"
        className="flex h-auto items-center justify-center gap-1 rounded border-[1.5px] border-accent/15 px-2 py-1 text-lg font-semibold"
      >
        {/* <Icon name="logo" className="h-6 w-6" /> */}
        BugBank
      </Link>
      {loading ? (
        <div className="flex -translate-x-1 items-center gap-2">
          <Loader className="animate-spin" size={24} />
        </div>
      ) : user ? (
        <Link
          href="/account"
          className="flex aspect-square h-2/3 items-center justify-center gap-4 rounded-full bg-accent/25"
        >
          {initials}
        </Link>
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
