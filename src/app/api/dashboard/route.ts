
import { NextResponse } from "next/server";
import { getUser, getAdmin } from "@/lib/supabase";

export async function GET() {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const sb = getAdmin();
  const { data: ws } = await sb
    .from("workspaces")
    .select("*")
    .eq("owner_id", user.id)
    .single();

  if (!ws) return NextResponse.json({ error: "No workspace" }, { status: 404 });

  const now = new Date();
  const dayAgo = new Date(now.getTime() - 86_400_000).toISOString();

  const [camps, dmsToday, commentsToday, leads] = await Promise.all([
    sb.from("campaigns").select("id,name,status,stats,trigger_mode,platform")
      .eq("workspace_id", ws.id).order("created_at", { ascending: false }),
    sb.from("dm_log").select("id", { count: "exact", head: true })
      .eq("workspace_id", ws.id).gte("created_at", dayAgo),
    sb.from("comments_log").select("id", { count: "exact", head: true })
      .eq("workspace_id", ws.id).gte("created_at", dayAgo),
    sb.from("leads").select("id", { count: "exact", head: true })
      .eq("workspace_id", ws.id),
  ]);

  return NextResponse.json({
    workspace:        ws,
    campaigns:        camps.data ?? [],
    campaigns_count:  camps.data?.length ?? 0,
    active_campaigns: camps.data?.filter(c => c.status === "active").length ?? 0,
    dms_today:        dmsToday.count   ?? 0,
    comments_today:   commentsToday.count ?? 0,
    leads_total:      leads.count      ?? 0,
  });
}
