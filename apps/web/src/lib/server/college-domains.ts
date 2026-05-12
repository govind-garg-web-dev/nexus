const BLOCKED = new Set(["gmail.com","yahoo.com","yahoo.in","outlook.com","hotmail.com","protonmail.com","icloud.com","rediffmail.com","live.com"]);
const ALLOWLIST = new Set(["iitb.ac.in","iitd.ac.in","iitm.ac.in","iitk.ac.in","iitkgp.ac.in","iitg.ac.in","iith.ac.in","iisc.ac.in","bits-pilani.ac.in","goa.bits-pilani.ac.in","hyderabad.bits-pilani.ac.in","nitt.edu","nitk.edu.in","nitw.ac.in","nitrr.ac.in","iiita.ac.in","iiitd.ac.in","iiitb.ac.in","iiith.ac.in","vit.ac.in","srmist.edu.in","manipal.edu","thapar.edu","dtu.ac.in","nsit.net","coep.org.in","vjti.ac.in","pict.edu"]);

export function isEmailDomainAllowed(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase();
  if (!domain) return false;
  if (BLOCKED.has(domain)) return false;
  if (domain.endsWith(".ac.in") || domain.endsWith(".edu.in")) return true;
  return ALLOWLIST.has(domain);
}
export function getDomainFromEmail(email: string): string | null {
  return email.split("@")[1]?.toLowerCase() ?? null;
}
