"use client";
import withAuth from "@/hooks/withAuth";
import React from "react";

interface IProviders {
  children: React.ReactNode;
}

const Providers = ({ children }: IProviders) => {
  return <div>{children}</div>;
};

export default withAuth(Providers);
