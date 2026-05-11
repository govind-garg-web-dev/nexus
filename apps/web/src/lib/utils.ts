import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatReliabilityScore(score: number): {
  tag: "Reliable" | "Mixed" | "Avoid";
  color: string;
} {
  if (score >= 75) return { tag: "Reliable", color: "text-emerald-400" };
  if (score >= 50) return { tag: "Mixed", color: "text-yellow-400" };
  return { tag: "Avoid", color: "text-red-400" };
}

export function getInitials(pseudonym: string): string {
  return pseudonym
    .split(/\s+/)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .slice(0, 2)
    .join("");
}
