
import { NextRequest, NextResponse } from "next/server";
import { getUser, getAdmin } from "@/lib/supabase";

async function getWsId(userId: string) {
  const sb = getAdmin();
  const { data } = await sb.from("workspaces").select("id").eq("owner_id", userId).single();
  return data?.id ?? null;
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const wsId = await getWsId(user.id);
  if (!wsId)  return NextResponse.json({ error: "Workspace not found" }, { status: 404 });

  const sb = getAdmin();
  const { data, error } = await sb
    .from("campaigns").select("*")
    .eq("id", params.id).eq("workspace_id", wsId).single();

  if (error || !data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ data });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const wsId = await getWsId(user.id);
  if (!wsId)  return NextResponse.json({ error: "Workspace not found" }, { status: 404 });

  const body = await req.json();
  const ALLOWED = [
    "name","status","trigger_mode","keywords","exclude_keywords",
    "message_template","link_url","public_reply_text","public_reply_enabled",
    "delay_type","one_time_per_user","follower_gate",
  ];

  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
  for (const k of ALLOWED) {
    if (k in body) update[k] = body[k];
  }

  const sb = getAdmin();
  const { data, error } = await sb
    .from("campaigns").update(update)
    .eq("id", params.id).eq("workspace_id", wsId)
    .select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const wsId = await getWsId(user.id);
  if (!wsId)  return NextResponse.json({ error: "Workspace not found" }, { status: 404 });

  const sb = getAdmin();
  const { error } = await sb
    .from("campaigns").delete()
    .eq("id", params.id).eq("workspace_id", wsId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
