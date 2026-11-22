
import { NextRequest, NextResponse } from "next/server";
import { getUser, getAdmin } from "@/lib/supabase";
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const sb = getAdmin();
  const { data: ws } = await sb.from("workspaces").select("id").eq("owner_id", user.id).single();
  if (!ws) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await sb.from("campaigns").update({ status: "paused" }).eq("connected_account_id", params.id).eq("workspace_id", ws.id);
  const { error } = await sb.from("connected_accounts").delete().eq("id", params.id).eq("workspace_id", ws.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
