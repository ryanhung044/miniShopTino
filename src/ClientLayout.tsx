import React from "react";
import { Navigation } from "./components/navigation";

const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {children}
      <Navigation />
    </>
  );
};

export default ClientLayout;
