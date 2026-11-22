
import { NextRequest, NextResponse } from "next/server";
import { getUser, getAdmin, PLAN_LIMITS } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { campaigns: rows } = await req.json() as { campaigns: Record<string,unknown>[] };
  if (!Array.isArray(rows) || !rows.length) {
    return NextResponse.json({ error: "No campaigns provided" }, { status: 400 });
  }

  const sb = getAdmin();
  const { data: ws } = await sb.from("workspaces").select("*").eq("owner_id", user.id).single();
  if (!ws) return NextResponse.json({ error: "No workspace" }, { status: 404 });

  const { count: existing } = await sb
    .from("campaigns").select("*", { count: "exact", head: true })
    .eq("workspace_id", ws.id);

  const limit = PLAN_LIMITS[ws.plan] ?? 10;
  const slots = limit - (existing ?? 0);
  if (slots <= 0) {
    return NextResponse.json({ error: `Campaign limit (${limit}) reached. Upgrade your plan.` }, { status: 403 });
  }

  const toCreate = rows.slice(0, slots).map(r => ({
    workspace_id:     ws.id,
    name:             r.name,
    platform:         r.platform ?? "instagram",
    status:           "active",
    post_url:         r.post_url,
    trigger_mode:     r.trigger_mode ?? "keyword",
    keywords:         r.keywords ?? [],
    exclude_keywords: [],
    message_template: r.message_template ?? "Hey {username}! Here is the link you asked for: {link}",
    link_url:         r.link_url,
    public_reply_text: null,
    delay_type:       "random",
    one_time_per_user: true,
    follower_gate:    false,
    cooldown_hours:   24,
    stats: { comments_matched:0, dms_sent:0, dms_failed:0, clicks:0 },
  }));

  const { data, error } = await sb.from("campaigns").insert(toCreate).select();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({
    created: data?.length ?? 0,
    skipped: rows.length - (data?.length ?? 0),
    data,
  }, { status: 201 });
}
