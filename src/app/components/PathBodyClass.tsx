// src/components/PathBodyClass.tsx
"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function PathBodyClass() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/login") {
      document.documentElement.classList.add("is-login-page");
    } else {
      document.documentElement.classList.remove("is-login-page");
    }
  }, [pathname]);

  return null;
}