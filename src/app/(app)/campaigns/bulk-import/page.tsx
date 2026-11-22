
"use client";
import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Upload, Download, CheckCircle, XCircle, AlertCircle, FileText, Zap } from "lucide-react";

interface Row { name:string; post_url:string; trigger_mode:string; keywords:string; link_url:string; status:"ok"|"error"; error?:string; }

const TEMPLATE_ROWS = [
  "name,post_url,trigger_mode,keywords,link_url,message_template",
  'Course Launch DM,https://instagram.com/p/ABC123,keyword,"link,price,buy",https://yoursite.com/course,"Hey {username}! Here is the link: {link}"',
  'Product Offer,https://instagram.com/p/DEF456,ai_intent,,https://yoursite.com/product,"Hi {username}! Check this out: {link}"',
  'Giveaway Entry,https://instagram.com/p/GHI789,keyword,"join,entry,participate",https://yoursite.com/giveaway,"You are entered {username}! Details: {link}"',
];

export default function BulkImportPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [dragging, setDragging] = useState(false);
  const [importing, setImporting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const parseCSV = (text: string) => {
    const rawLines = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim().split("\n").filter(Boolean);
    if (rawLines.length < 2) { setError("CSV must have a header row and at least one data row."); return; }
    const headers = rawLines[0].toLowerCase().split(",").map(h => h.trim().replace(/^"|"$/g, ""));
    const parsed: Row[] = rawLines.slice(1).map(line => {
      const vals: string[] = [];
      let cur = "", inQ = false;
      for (const ch of line) {
        if (ch === '"') { inQ = !inQ; }
        else if (ch === "," && !inQ) { vals.push(cur.trim()); cur = ""; }
        else { cur += ch; }
      }
      vals.push(cur.trim());
      const obj: Record<string, string> = {};
      headers.forEach((h, i) => { obj[h] = (vals[i] || "").replace(/^"|"$/g, ""); });
      const errs: string[] = [];
      if (!obj.name) errs.push("name required");
      if (!obj.post_url || !obj.post_url.includes("instagram.com")) errs.push("invalid post_url");
      if (!obj.link_url || !obj.link_url.startsWith("http")) errs.push("invalid link_url");
      return {
        name: obj.name || "",
        post_url: obj.post_url || "",
        trigger_mode: obj.trigger_mode || "keyword",
        keywords: obj.keywords || "",
        link_url: obj.link_url || "",
        status: errs.length ? "error" : "ok",
        error: errs.join(", "),
      } as Row;
    });
    setRows(parsed); setError(""); setDone(false);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const file = e.dataTransfer.files[0];
    if (!file || !file.name.endsWith(".csv")) { setError("Please upload a .csv file"); return; }
    const reader = new FileReader();
    reader.onload = ev => parseCSV(ev.target?.result as string);
    reader.readAsText(file);
  }, []);

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => parseCSV(ev.target?.result as string);
    reader.readAsText(file);
  };

  const handleImport = async () => {
    const valid = rows.filter(r => r.status === "ok");
    if (!valid.length) return;
    setImporting(true);
    try {
      for (const row of valid) {
        await fetch("/api/campaigns", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: row.name,
            post_url: row.post_url,
            trigger_mode: row.trigger_mode,
            keywords: row.keywords ? row.keywords.split(",").map(k => k.trim()) : [],
            link_url: row.link_url,
            message_template: "Hey {username}! Here is the link you asked for: {link}",
            platform: "instagram",
            delay_type: "random",
            one_time_per_user: true,
            follower_gate: false,
            public_reply_enabled: false,
            public_reply_text: "",
          }),
        });
      }
      setDone(true);
    } catch {
      setError("Import failed. Please try again.");
    } finally {
      setImporting(false);
    }
  };

  const downloadTemplate = () => {
    const blob = new Blob([TEMPLATE_ROWS.join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "azeel-dm-import-template.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const valid = rows.filter(r => r.status === "ok").length;
  const invalid = rows.filter(r => r.status === "error").length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/campaigns" className="btn btn-ghost btn-icon"><ArrowLeft size={18} /></Link>
        <div>
          <h1 className="text-xl font-black text-slate-900">Bulk Import Campaigns</h1>
          <p className="text-slate-500 text-sm">Upload a CSV to create up to 50 campaigns at once</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5">
          <h3 className="font-bold text-indigo-800 mb-2 flex items-center gap-2"><FileText size={15} />CSV Format</h3>
          <ul className="text-indigo-700 text-xs space-y-1.5">
            {[
              ["name","Campaign name (required)"],
              ["post_url","Instagram post URL (required)"],
              ["trigger_mode","keyword / ai_intent / any"],
              ["keywords","comma-separated (for keyword mode)"],
              ["link_url","Destination URL (required)"],
              ["message_template","use {username} and {link}"],
            ].map(([k, v]) => (
              <li key={k}><strong className="text-indigo-800">{k}</strong> — {v}</li>
            ))}
          </ul>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 mb-2">Download Template</h3>
            <p className="text-slate-500 text-sm mb-4">Pre-filled CSV with 3 example campaigns ready to edit.</p>
          </div>
          <button onClick={downloadTemplate} className="btn btn-outline btn-sm w-full justify-center">
            <Download size={13} />Download Template CSV
          </button>
        </div>
      </div>

      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer ${dragging ? "border-indigo-500 bg-indigo-50" : "border-slate-300 hover:border-indigo-400 hover:bg-slate-50"}`}
      >
        <Upload size={36} className={`mx-auto mb-4 ${dragging ? "text-indigo-600" : "text-slate-300"}`} />
        <h3 className="font-bold text-slate-900 mb-2">Drop your CSV here</h3>
        <p className="text-slate-500 text-sm mb-5">or click to browse from your computer</p>
        <label className="btn btn-brand cursor-pointer" style={{ boxShadow: "0 4px 14px rgba(79,70,229,0.35)" }}>
          <Upload size={15} />Choose CSV File
          <input type="file" accept=".csv" className="sr-only" onChange={onFile} />
        </label>
      </div>

      {error && (
        <div className="alert alert-err">
          <AlertCircle size={15} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {rows.length > 0 && !done && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="font-bold text-slate-900">Preview — {rows.length} rows</h2>
            <div className="flex gap-2">
              {valid > 0 && <span className="badge badge-green"><CheckCircle size={10} />{valid} valid</span>}
              {invalid > 0 && <span className="badge badge-red"><XCircle size={10} />{invalid} errors</span>}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="tbl">
              <thead>
                <tr><th>#</th><th>Name</th><th>Post URL</th><th>Trigger</th><th>Keywords</th><th>Status</th></tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i} className={r.status === "error" ? "bg-red-50/50" : ""}>
                    <td className="text-slate-400 text-xs">{i + 1}</td>
                    <td className="font-medium text-sm text-slate-800">{r.name || <span className="text-red-400">—</span>}</td>
                    <td className="text-xs text-slate-400 max-w-[150px] truncate">{r.post_url || "—"}</td>
                    <td>
                      <span className={`badge text-xs ${r.trigger_mode === "ai_intent" ? "badge-accent" : r.trigger_mode === "keyword" ? "badge-brand" : "badge-gray"}`}>
                        {r.trigger_mode}
                      </span>
                    </td>
                    <td className="text-xs text-slate-400">{r.keywords || "—"}</td>
                    <td>
                      {r.status === "ok"
                        ? <span className="badge badge-green text-xs"><CheckCircle size={10} />Ready</span>
                        : <span className="badge badge-red text-xs" title={r.error}><XCircle size={10} />Error</span>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-sm">
              {invalid > 0 && `${invalid} rows with errors will be skipped. `}
              {valid} campaign{valid !== 1 ? "s" : ""} will be created.
            </p>
            <button
              onClick={handleImport}
              disabled={importing || valid === 0}
              className="btn btn-brand shrink-0 disabled:opacity-50"
              style={{ boxShadow: "0 4px 14px rgba(79,70,229,0.35)" }}
            >
              {importing
                ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <><Zap size={14} />Import {valid} Campaign{valid !== 1 ? "s" : ""}</>
              }
            </button>
          </div>
        </motion.div>
      )}

      {done && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl border border-green-200 p-10 text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Import Complete!</h2>
          <p className="text-slate-500 mb-6">{valid} campaign{valid !== 1 ? "s" : ""} created successfully.</p>
          <Link href="/campaigns" className="btn btn-brand" style={{ boxShadow: "0 4px 14px rgba(79,70,229,0.35)" }}>
            View All Campaigns
          </Link>
        </motion.div>
      )}
    </div>
  );
}
