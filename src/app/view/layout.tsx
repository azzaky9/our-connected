import React from "react";
import Navbar from "@/components/Navbar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <React.Fragment>
      <header>
        <Navbar />
      </header>
      {children}
    </React.Fragment>
  );
};

export default Layout;
