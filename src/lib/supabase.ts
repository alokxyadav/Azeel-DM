
import { createClient } from "@supabase/supabase-js";
import type { CookieOptions } from "@supabase/ssr";

export function getAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function getServer() {
  const { createServerClient } = await import("@supabase/ssr");
  const { cookies } = await import("next/headers");
  const jar = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get:    (name: string) => jar.get(name)?.value,
        set:    (name: string, value: string, options: CookieOptions) => { jar.set({ name, value, ...options }); },
        remove: (name: string, options: CookieOptions) => { jar.set({ name, value: "", ...options }); },
      },
    }
  );
}

export async function getUser() {
  try {
    const sb = await getServer();
    const { data: { user } } = await sb.auth.getUser();
    return user;
  } catch {
    return null;
  }
}

export const PLAN_LIMITS: Record<string, number> = {
  free: 10, trial: 10, starter: 10, pro: 30, growth: 50,
};
