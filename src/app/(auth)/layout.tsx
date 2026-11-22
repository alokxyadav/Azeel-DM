
import Link from "next/link";
import Image from "next/image";
export default function AuthLayout({children}:{children:React.ReactNode}){
  return(
    <div className="min-h-screen flex flex-col" style={{background:"linear-gradient(150deg,#f8fafc 0%,#eef2ff 40%,#fdf4ff 100%)"}}>
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-40"/>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-purple-100 rounded-full blur-3xl opacity-30"/>
      </div>
      <header className="relative z-10 flex items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg overflow-hidden ring-2 ring-indigo-100 group-hover:ring-indigo-200 transition-all">
            <Image src="https://azeltechnologies.com/favicon.png" alt="Azeel DM" width={32} height={32} unoptimized/>
          </div>
          <span className="font-extrabold text-slate-900">Azeel <span className="tg">DM</span></span>
        </Link>
        <Link href="/" className="text-sm text-slate-500 hover:text-slate-700 transition-colors">← Back to home</Link>
      </header>
      <main className="relative z-10 flex-1 flex items-center justify-center p-4">{children}</main>
      <footer className="relative z-10 py-5 text-center text-xs text-slate-400 flex justify-center gap-5">
        {[["Privacy","/privacy"],["Terms","/terms"],["Contact","/contact"]].map(([l,h])=>(
          <Link key={l} href={h} className="hover:text-slate-600 transition-colors">{l}</Link>
        ))}
      </footer>
    </div>
  );
}
