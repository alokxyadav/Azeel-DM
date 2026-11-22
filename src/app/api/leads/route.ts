
import { NextRequest, NextResponse } from "next/server";
import { getUser, getAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const sb = getAdmin();
  const { data: ws } = await sb.from("workspaces").select("id").eq("owner_id", user.id).single();
  if (!ws) return NextResponse.json({ data: [] });

  const { searchParams } = new URL(req.url);
  const campaign = searchParams.get("campaign");
  const page     = parseInt(searchParams.get("page") ?? "1");
  const limit    = 50;
  const from     = (page - 1) * limit;

  let query = sb
    .from("leads").select("*", { count: "exact" })
    .eq("workspace_id", ws.id)
    .order("created_at", { ascending: false })
    .range(from, from + limit - 1);

  if (campaign) query = query.eq("campaign_id", campaign);

  const { data, count, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ data: data ?? [], total: count ?? 0, page, limit });
}
