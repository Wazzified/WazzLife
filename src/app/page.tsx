// src/app/page.tsx
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function Home() {
  const session = await auth();
  
  // Kalau belum login, redirect ke /login (biar middleware handle)
  if (!session) {
    redirect("/login");
  }
  
  // Kalau udah login, redirect ke /dashboard
  redirect("/dashboard");
}