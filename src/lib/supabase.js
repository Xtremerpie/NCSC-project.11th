// Lightweight Supabase client built on plain fetch calls to the REST
// (PostgREST) and Storage APIs — no @supabase/supabase-js dependency
// needed for what this app does.

export const SUPABASE_URL = "https://yfircmjyzurrupnppezk.supabase.co";
export const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlmaXJjbWp5enVycnVwbnBwZXprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUzMTkyMTUsImV4cCI6MjEwMDg5NTIxNX0.GiOpeWJYyc3jW01kP4SQ2DrVXdRK3vXLlmxDhLsHGiY";

export const SB_TABLE = "focusheist_progress";
export const SB_BUCKET = "classwork-files";

const authHeaders = (extra = {}) => ({
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
  ...extra,
});

/* ---------- app state (one JSON row per device) ---------- */

export async function sbFetchState(deviceId) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/${SB_TABLE}?device_id=eq.${deviceId}&select=state`,
    { headers: authHeaders() }
  );
  if (!res.ok) throw new Error(`Supabase read failed (${res.status})`);
  return res.json();
}

export async function sbSaveState(deviceId, state) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${SB_TABLE}?on_conflict=device_id`, {
    method: "POST",
    headers: authHeaders({
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=minimal",
    }),
    body: JSON.stringify([{ device_id: deviceId, state, updated_at: new Date().toISOString() }]),
  });
  if (!res.ok) throw new Error(`Supabase write failed (${res.status})`);
}

/* ---------- classwork file storage ---------- */
// Requires a public bucket named "classwork-files" — see README for the
// SQL/dashboard steps to create it.

export async function sbUploadFile(path, file) {
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${SB_BUCKET}/${path}`, {
    method: "POST",
    headers: authHeaders({ "Content-Type": file.type || "application/octet-stream", "x-upsert": "true" }),
    body: file,
  });
  if (!res.ok) throw new Error(`File upload failed (${res.status})`);
  return sbPublicUrl(path);
}

export function sbPublicUrl(path) {
  return `${SUPABASE_URL}/storage/v1/object/public/${SB_BUCKET}/${path}`;
}

export async function sbDeleteFile(path) {
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${SB_BUCKET}`, {
    method: "DELETE",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({ prefixes: [path] }),
  });
  if (!res.ok) throw new Error(`File delete failed (${res.status})`);
}
