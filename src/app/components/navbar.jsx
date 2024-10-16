import React from "react";

const Navbar = () => {
  return (
    <div className="absolute w-full flex items-center justify-between h-12 bg-red-300 text-white">
      Navbar
    </div>
  );
};

const NavbarWrapper = ({ children }) => {
  return (
    <div className="flex flex-col h-screen w-full bg-green-900">
      <Navbar />
      <main className="flex-grow w-full pt-12">{children}</main>
    </div>
  );
};

export default NavbarWrapper;
