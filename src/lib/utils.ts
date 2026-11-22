
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes without conflicts */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format date to Indian locale */
export function fmtDate(d: string | Date) {
  return new Date(d).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
}

/** Format datetime to Indian locale */
export function fmtDT(d: string | Date) {
  return new Date(d).toLocaleString("en-IN", {
    day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
  });
}

/** Format number with commas */
export function fmtNum(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString("en-IN");
}

/** Match comment against keywords */
export function matchKeyword(text: string, keywords: string[]): string | null {
  const lower = text.toLowerCase();
  return keywords.find(k => lower.includes(k.toLowerCase())) ?? null;
}

/** Detect buying intent (Hindi + English) */
export function matchIntent(text: string): boolean {
  const INTENT = [
    "price","cost","buy","link","interested","send","how much",
    "bhejo","khareed","kitna","details","rate","order","info",
    "dm","want","need","chahiye","batao","kab","kahan",
  ];
  const lower = text.toLowerCase();
  return INTENT.some(k => lower.includes(k));
}

/** Interpolate DM template variables */
export function buildMessage(tpl: string, vars: Record<string, string>): string {
  return Object.entries(vars).reduce(
    (t, [k, v]) => t.replaceAll(`{${k}}`, v),
    tpl
  );
}

/** Extract Instagram post ID from URL */
export function extractPostId(url: string): string | null {
  const m = url.match(/instagram\.com\/(p|reel|tv)\/([A-Za-z0-9_-]+)/);
  return m?.[2] ?? null;
}

/** Sleep helper */
export const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
