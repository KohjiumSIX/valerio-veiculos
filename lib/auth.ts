const normalizeEmail = (value?: string | null) =>
  (value || "").trim().toLowerCase();

export function getAdminEmails() {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((item) => normalizeEmail(item))
    .filter(Boolean);
}

export function isAdminEmail(email?: string | null) {
  const normalized = normalizeEmail(email);

  if (!normalized) return false;

  const admins = getAdminEmails();

  if (admins.length === 0) {
    console.warn(
      "ADMIN_EMAILS não foi definida. Configure no ambiente para proteger o admin."
    );
    return false;
  }

  return admins.includes(normalized);
}