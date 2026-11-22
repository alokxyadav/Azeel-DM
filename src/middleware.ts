
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import type { CookieOptions } from "@supabase/ssr";

const PROTECTED = ["/dashboard","/campaigns","/connect-accounts","/logs","/leads","/billing","/settings","/templates","/analytics","/onboarding"];
const AUTH_ONLY  = ["/login","/register","/forgot-password","/reset-password"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isProtected = PROTECTED.some(p => pathname === p || pathname.startsWith(p + "/"));
  const isAuthOnly  = AUTH_ONLY.some(p => pathname === p);
  if (!isProtected && !isAuthOnly) return NextResponse.next();

  const res = NextResponse.next();
  const sb  = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get:    (name: string) => req.cookies.get(name)?.value,
        set:    (name: string, value: string, options: CookieOptions) => { res.cookies.set({ name, value, ...options }); },
        remove: (name: string, options: CookieOptions) => { res.cookies.set({ name, value: "", ...options }); },
      },
    }
  );
  const { data: { user } } = await sb.auth.getUser();

  if (isProtected && !user) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  if (isAuthOnly && user) {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/webhook|api/go|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
