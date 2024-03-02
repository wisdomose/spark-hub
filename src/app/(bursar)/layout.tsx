"use client"
import BursarContextProvider from "@/store/bursar/store";

export default function BursarLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <BursarContextProvider>{children}</BursarContextProvider>;
}
