export function isPlaceholderSecret(value?: string | null): boolean {
  const v = String(value || "").trim();
  if (!v) return true;
  return /^(dummy|dummy-admin-token|changeme|secret|password|test)$/i.test(v);
}

export function timingSafeEqualString(left: string, right: string): boolean {
  const encoder = new TextEncoder();
  const a = encoder.encode(String(left || ""));
  const b = encoder.encode(String(right || ""));
  const len = Math.max(a.length, b.length, 1);
  let mismatch = a.length !== b.length ? 1 : 0;
  for (let i = 0; i < len; i++) {
    mismatch |= (a[i] ?? 0) ^ (b[i] ?? 0);
  }
  return mismatch === 0;
}
