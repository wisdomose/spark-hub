"use client"

import ManagerContextProvider from "@/store/manager/store";

export default function BursarLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ManagerContextProvider>{children}</ManagerContextProvider>;
}
