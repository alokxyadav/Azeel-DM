
"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Bell, Shield, Save, Key, Check, AlertCircle, Eye, EyeOff } from "lucide-react";

type Tab = "profile" | "notifications" | "security";

export default function SettingsPage() {
  const [tab,     setTab]     = useState<Tab>("profile");
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [error,   setError]   = useState("");
  const [showPw,  setShowPw]  = useState(false);
  const [profile, setProfile] = useState({ name:"", email:"", company:"" });
  const [notifs,  setNotifs]  = useState({ dm_sent:true, dm_failed:true, campaign_paused:false, weekly_report:false });
  const [pwForm,  setPwForm]  = useState({ current:"", next:"", confirm:"" });

  useEffect(() => {
    (async () => {
      const { createClient } = await import("@supabase/supabase-js");
      const sb = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      const { data } = await sb.auth.getUser();
      if (data.user) {
        setProfile({
          name:    (data.user.user_metadata?.full_name as string) ?? "",
          email:   data.user.email ?? "",
          company: (data.user.user_metadata?.company as string) ?? "",
        });
      }
    })();
  }, []);

  const saveProfile = async () => {
    setSaving(true); setError(""); setSaved(false);
    try {
      const { createClient } = await import("@supabase/supabase-js");
      const sb = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      const { error: err } = await sb.auth.updateUser({
        data: { full_name: profile.name, company: profile.company },
      });
      if (err) throw err;
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e: unknown) {
      setError((e as Error).message ?? "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const savePw = async () => {
    if (pwForm.next !== pwForm.confirm) { setError("Passwords do not match"); return; }
    if (pwForm.next.length < 8) { setError("Password must be at least 8 characters"); return; }
    setSaving(true); setError(""); setSaved(false);
    try {
      const { createClient } = await import("@supabase/supabase-js");
      const sb = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      const { error: err } = await sb.auth.updateUser({ password: pwForm.next });
      if (err) throw err;
      setSaved(true);
      setPwForm({ current:"", next:"", confirm:"" });
      setTimeout(() => setSaved(false), 2500);
    } catch (e: unknown) {
      setError((e as Error).message ?? "Failed to update password");
    } finally {
      setSaving(false);
    }
  };

  const TABS: { k:Tab; l:string; icon:typeof User }[] = [
    { k:"profile",       l:"Profile",       icon:User   },
    { k:"notifications", l:"Notifications", icon:Bell   },
    { k:"security",      l:"Security",      icon:Shield },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Settings</h1>
        <p className="text-slate-500 text-sm mt-0.5">Manage your account preferences</p>
      </div>

      <div className="ptabs">
        {TABS.map(t => (
          <button key={t.k} onClick={() => { setTab(t.k); setError(""); setSaved(false); }}
            className={`ptab flex items-center gap-2 justify-center ${tab === t.k ? "on" : ""}`}>
            <t.icon size={14} />{t.l}
          </button>
        ))}
      </div>

      <motion.div key={tab} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
        transition={{ duration:0.2 }}
        className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">

        {tab === "profile" && (
          <>
            <h2 className="font-bold text-slate-900">Profile Information</h2>
            {[
              { l:"Full Name",      k:"name",    t:"text",  p:"Your full name"   },
              { l:"Email Address",  k:"email",   t:"email", p:"your@email.com", disabled:true },
              { l:"Company / Brand",k:"company", t:"text",  p:"Your brand name"  },
            ].map(f => (
              <div key={f.k}>
                <label className="lbl">{f.l}</label>
                <input
                  type={f.t}
                  value={profile[f.k as keyof typeof profile]}
                  onChange={e => !f.disabled && setProfile(p => ({ ...p, [f.k]: e.target.value }))}
                  placeholder={f.p}
                  disabled={"disabled" in f && f.disabled}
                  className={`inp ${("disabled" in f && f.disabled) ? "opacity-60 cursor-not-allowed" : ""}`}
                />
                {"disabled" in f && f.disabled && (
                  <p className="hint">Email cannot be changed. Contact support to update.</p>
                )}
              </div>
            ))}
            {error  && <div className="alert alert-err"><AlertCircle size={14} className="shrink-0"/><span className="text-sm">{error}</span></div>}
            {saved  && <div className="alert alert-success"><Check size={14} className="shrink-0"/><span className="text-sm">Profile saved successfully!</span></div>}
            <button onClick={saveProfile} disabled={saving}
              className="btn btn-brand btn-sm" style={{ boxShadow:"0 4px 12px rgba(79,70,229,0.3)" }}>
              {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Save size={14}/>Save Changes</>}
            </button>
          </>
        )}

        {tab === "notifications" && (
          <>
            <h2 className="font-bold text-slate-900">Notification Preferences</h2>
            {[
              { k:"dm_sent"         as const, l:"DM Sent Successfully",  d:"Get notified when a DM is delivered"       },
              { k:"dm_failed"       as const, l:"DM Failed",             d:"Alert when DM delivery fails"              },
              { k:"campaign_paused" as const, l:"Campaign Auto-paused",  d:"When campaign pauses due to errors"        },
              { k:"weekly_report"   as const, l:"Weekly Report",         d:"Weekly email summary of all campaigns"     },
            ].map(n => (
              <div key={n.k} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <p className="font-semibold text-sm text-slate-900">{n.l}</p>
                  <p className="text-slate-400 text-xs mt-0.5">{n.d}</p>
                </div>
                <label className="tog">
                  <input type="checkbox" checked={notifs[n.k]} onChange={e => setNotifs(v => ({ ...v, [n.k]: e.target.checked }))} />
                  <div className="tog-sl" />
                </label>
              </div>
            ))}
            <button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}
              className="btn btn-brand btn-sm" style={{ boxShadow:"0 4px 12px rgba(79,70,229,0.3)" }}>
              <Save size={14} />{saved ? "Saved!" : "Save Preferences"}
            </button>
          </>
        )}

        {tab === "security" && (
          <>
            <h2 className="font-bold text-slate-900">Change Password</h2>
            {[
              { l:"New Password",     k:"next",    p:"At least 8 characters" },
              { l:"Confirm Password", k:"confirm", p:"Repeat new password"   },
            ].map(f => (
              <div key={f.k}>
                <label className="lbl">{f.l}</label>
                <div className="inp-wrap">
                  <Key size={14} className="ico" />
                  <input
                    type={showPw ? "text" : "password"}
                    value={pwForm[f.k as keyof typeof pwForm]}
                    onChange={e => setPwForm(v => ({ ...v, [f.k]: e.target.value }))}
                    placeholder={f.p}
                    className="inp pr-11"
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1">
                    {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
            ))}
            {error && <div className="alert alert-err"><AlertCircle size={14} className="shrink-0"/><span className="text-sm">{error}</span></div>}
            {saved && <div className="alert alert-success"><Check size={14} className="shrink-0"/><span className="text-sm">Password updated!</span></div>}
            <button onClick={savePw} disabled={saving}
              className="btn btn-brand btn-sm" style={{ boxShadow:"0 4px 12px rgba(79,70,229,0.3)" }}>
              {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Save size={14}/>Update Password</>}
            </button>

            <div className="pt-4 border-t border-slate-200">
              <h3 className="font-bold text-red-600 text-sm mb-2">Danger Zone</h3>
              <p className="text-slate-400 text-xs mb-3">Permanently delete your account and all data. This cannot be undone.</p>
              <button className="btn btn-danger btn-sm">Delete Account</button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
