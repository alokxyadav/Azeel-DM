
import { NextResponse } from "next/server";
import { getUser, getAdmin } from "@/lib/supabase";
export async function GET() {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const sb = getAdmin();
  const { data: ws } = await sb.from("workspaces").select("id").eq("owner_id", user.id).single();
  if (!ws) return NextResponse.json({ data: [] });
  const { data } = await sb.from("connected_accounts").select("*").eq("workspace_id", ws.id).order("created_at", { ascending: false });
  return NextResponse.json({ data: data ?? [] });
}
