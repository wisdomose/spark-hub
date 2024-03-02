"use client"
import PotterContextProvider from "@/store/potter/store";

export default function PotterLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <PotterContextProvider>{children}</PotterContextProvider>;
}
