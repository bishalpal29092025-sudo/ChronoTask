import { redirect } from "next/navigation";

import { auth } from "@/auth";
import Navbar from "@/components/Navbar";

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#07070a] text-white">
      <Navbar />
      <main>{children}</main>
    </div>
  );
}