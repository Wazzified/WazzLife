 // middleware.ts
import { auth } from "@/lib/auth" 
import { NextResponse } from "next/server"

export default auth((req) => {
  // Jika user belum login dan bukan di halaman login
  if (!req.auth && req.nextUrl.pathname !== "/login") {
    const newUrl = new URL("/login", req.nextUrl.origin)
    return Response.redirect(newUrl)
  }

  // Jika sudah login dan ada di halaman login, redirect ke dashboard
  if (req.auth && req.nextUrl.pathname === "/login") {
    return Response.redirect(new URL("/dashboard", req.nextUrl.origin))
  }
})

// Tentukan route mana yang mau diproteksi
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}