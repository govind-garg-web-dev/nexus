/**
 * Allowlist of valid institutional email domains.
 * This is the first security gate — no personal email gets through.
 *
 * Rules:
 * - Must end with .ac.in or .edu.in OR be on the explicit allowlist.
 * - Gmail, Yahoo, Outlook, Hotmail, Proton: hard-rejected. No exceptions.
 */

const BLOCKED_PERSONAL_DOMAINS = new Set([
  "gmail.com",
  "yahoo.com",
  "yahoo.in",
  "outlook.com",
  "hotmail.com",
  "protonmail.com",
  "icloud.com",
  "rediffmail.com",
  "live.com",
]);

// Explicit allowlist for colleges that use custom domains not ending in .ac.in/.edu.in
const EXPLICIT_ALLOWLIST = new Set([
  "iitb.ac.in",
  "iitd.ac.in",
  "iitm.ac.in",
  "iitk.ac.in",
  "iitkgp.ac.in",
  "iitg.ac.in",
  "iith.ac.in",
  "iitbbs.ac.in",
  "iitmandi.ac.in",
  "iitpkd.ac.in",
  "iitropar.ac.in",
  "iisc.ac.in",
  "bits-pilani.ac.in",
  "goa.bits-pilani.ac.in",
  "hyderabad.bits-pilani.ac.in",
  "nitt.edu",
  "nitk.edu.in",
  "nitw.ac.in",
  "nitrr.ac.in",
  "nith.ac.in",
  "mnit.ac.in",
  "svnit.ac.in",
  "iiita.ac.in",
  "iiitd.ac.in",
  "iiitb.ac.in",
  "iiith.ac.in",
  "iiitdmj.ac.in",
  "iimb.ac.in",
  "iima.ac.in",
  "iimc.ac.in",
  "iimk.ac.in",
  "iimindore.ac.in",
  "vit.ac.in",
  "srmist.edu.in",
  "manipal.edu",
  "thapar.edu",
  "dtu.ac.in",
  "nsit.net",
  "coep.org.in",
  "vjti.ac.in",
  "pict.edu",
]);

export function isEmailDomainAllowed(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase();
  if (!domain) return false;

  // Hard block personal domains
  if (BLOCKED_PERSONAL_DOMAINS.has(domain)) return false;

  // Allow .ac.in and .edu.in catch-all
  if (domain.endsWith(".ac.in") || domain.endsWith(".edu.in")) return true;

  // Allow explicit whitelist
  if (EXPLICIT_ALLOWLIST.has(domain)) return true;

  return false;
}

export function getDomainFromEmail(email: string): string | null {
  return email.split("@")[1]?.toLowerCase() ?? null;
}
