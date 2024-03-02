"use client"
import StudentContextProvider from "@/store/student/store";

export default function StudentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <StudentContextProvider>{children}</StudentContextProvider>;
}
