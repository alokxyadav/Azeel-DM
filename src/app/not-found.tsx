
import Link from "next/link";
import { Home } from "lucide-react";
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <div className="text-center max-w-md">
        <div className="text-8xl font-black text-indigo-600 mb-4">404</div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">Page not found</h2>
        <p className="text-slate-500 text-sm mb-8">The page you are looking for does not exist or has been moved.</p>
        <Link href="/" className="btn btn-brand" style={{boxShadow:"0 4px 14px rgba(79,70,229,.35)"}}>
          <Home size={15}/>Go Home
        </Link>
      </div>
    </div>
  );
}
