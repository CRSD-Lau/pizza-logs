"use server";

export async function verifyAdminSecret(secret: string): Promise<boolean> {
  const configured = process.env.ADMIN_SECRET;
  if (!configured) return true; // dev: no secret set → allow
  return secret === configured;
}
