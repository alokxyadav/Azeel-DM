
const SECTIONS = [
  ["1. Information We Collect",  "We collect information you provide (name, email) when creating an account. When you connect Instagram or Facebook, we receive and store your access tokens (encrypted), page IDs, and account names via the official Meta OAuth flow. We collect usage data including campaign activity, DM logs, and click events to provide our service."],
  ["2. How We Use Your Information","We use your information to: provide and improve the Azeel DM service, send transactional emails, respond to support requests, and display analytics. We do not use your data for advertising or sell it to third parties."],
  ["3. Meta Access Tokens",     "Your Instagram and Facebook access tokens are encrypted with AES-256-GCM before being stored. These tokens are used only to execute DM automations you configure. Tokens are never exposed in the frontend and are only decrypted server-side when calling the Meta API."],
  ["4. Data Storage and Security","Data is stored in Supabase with Row Level Security (RLS) policies ensuring each workspace can only access its own data. All data is transmitted over SSL/TLS. Access to production data is restricted to essential team members."],
  ["5. Data Sharing",           "We do not sell, rent, or trade your personal information. We may share data with: Supabase (database), Razorpay (payments), Resend (email), and Anthropic (AI features — comment text only, anonymized). All processors are contractually obligated to protect your data."],
  ["6. Your Rights",            "You have the right to access, correct, delete, or export your personal data. To exercise these rights, contact privacy@azeeldm.com. We will respond within 30 days."],
  ["7. Data Retention",         "We retain your data while your account is active. When you delete your account, personal data is deleted within 30 days, except billing records required by Indian tax law (7 years). Campaign logs are retained for 90 days after deletion."],
  ["8. Children Privacy",       "Azeel DM is not intended for users under 18 years of age. We do not knowingly collect information from children under 18. If we become aware of such data, we will delete it promptly."],
  ["9. Changes to This Policy", "We may update this Privacy Policy from time to time. We will notify you of significant changes by email at least 14 days before they take effect."],
];
export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-slate-50 border-b border-slate-200 py-16 px-4">
        <div className="wrap max-w-3xl mx-auto">
          <h1 className="text-4xl font-black text-slate-900 mb-3">Privacy Policy</h1>
          <p className="text-slate-500">Last updated: December 2024  ·  Effective: December 1, 2024</p>
        </div>
      </div>
      <div className="py-16 px-4">
        <div className="wrap max-w-3xl mx-auto">
          <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-10">
            <p className="text-green-800 text-sm font-medium">
              We take your privacy seriously. Meta tokens are encrypted with AES-256-GCM. We never sell your data.
              Questions? Email{" "}
              <a href="mailto:privacy@azeeldm.com" className="text-green-700 underline font-semibold">privacy@azeeldm.com</a>
            </p>
          </div>
          <div className="space-y-8">
            {SECTIONS.map(([title, body]) => (
              <div key={title} className="border-b border-slate-100 pb-8 last:border-0">
                <h2 className="text-lg font-black text-slate-900 mb-3">{title}</h2>
                <p className="text-slate-600 leading-relaxed text-sm">{body}</p>
              </div>
            ))}
          </div>
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6 mt-10">
            <h3 className="font-bold text-indigo-800 mb-1">Privacy Contact</h3>
            <p className="text-indigo-700 text-sm">privacy@azeeldm.com  ·  Azeel Technologies  ·  India</p>
          </div>
        </div>
      </div>
    </div>
  );
}
