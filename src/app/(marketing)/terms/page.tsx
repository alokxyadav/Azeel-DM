
const SECTIONS = [
  ["1. Acceptance of Terms",    "By creating an account on Azeel DM, you agree to these Terms of Service and our Privacy Policy. If you do not agree, please do not use the service. These terms govern your access to and use of the Azeel DM platform operated by Azeel Technologies."],
  ["2. Description of Service", "Azeel DM is an Instagram and Facebook comment-to-DM automation platform using the official Meta Graph API. We enable businesses and creators to automatically send direct messages when users comment specific keywords on their social media posts."],
  ["3. Meta Platform Compliance","You agree to comply with Meta Platform Terms, Instagram Community Guidelines, and Facebook Terms of Service at all times. You are solely responsible for any violations of Meta policies resulting from your use of our service."],
  ["4. Prohibited Uses",        "You must not use Azeel DM to send spam, unsolicited messages, or content that violates any law. Prohibited content includes harassment, hate speech, adult content, illegal products, misleading information, and anything violating Meta Community Standards."],
  ["5. Subscription and Billing","Paid plans are billed monthly or annually. The Rs.7 trial provides 7 days of Starter plan access, after which it auto-renews at the standard rate unless cancelled. All prices are in INR and include applicable taxes."],
  ["6. Refund Policy",          "We offer a 7-day money-back guarantee on all paid plans from the date of first payment. To request a refund, contact support@azeeldm.com within 7 days. Refunds are processed within 5-7 business days."],
  ["7. Data and Privacy",       "We store your Meta access tokens encrypted with AES-256-GCM. We do not sell your data to third parties. You retain ownership of all content you create through our platform."],
  ["8. Service Availability",   "We target 99.9% uptime but do not guarantee uninterrupted service. We are not liable for downtime caused by Meta API outages, scheduled maintenance, or circumstances beyond our control."],
  ["9. Account Termination",    "We may terminate your account for violations of these terms. You may cancel at any time from billing settings. Upon termination, your data will be deleted within 30 days, except where required by law."],
  ["10. Limitation of Liability","Azeel Technologies is not liable for indirect, incidental, or consequential damages arising from use of the service. Our maximum liability is limited to amounts paid in the 3 months preceding any claim."],
  ["11. Governing Law",         "These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts of India."],
];
export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-slate-50 border-b border-slate-200 py-16 px-4">
        <div className="wrap max-w-3xl mx-auto">
          <h1 className="text-4xl font-black text-slate-900 mb-3">Terms of Service</h1>
          <p className="text-slate-500">Last updated: December 2024  ·  Effective: December 1, 2024</p>
        </div>
      </div>
      <div className="py-16 px-4">
        <div className="wrap max-w-3xl mx-auto">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-10">
            <p className="text-amber-800 text-sm font-medium">
              By using Azeel DM you agree to these terms. Questions? Email{" "}
              <a href="mailto:support@azeeldm.com" className="text-amber-700 underline font-semibold">support@azeeldm.com</a>
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
            <h3 className="font-bold text-indigo-800 mb-1">Contact</h3>
            <p className="text-indigo-700 text-sm">Azeel Technologies  ·  support@azeeldm.com  ·  India</p>
          </div>
        </div>
      </div>
    </div>
  );
}
