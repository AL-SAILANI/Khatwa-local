import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Daily keep-alive for the Supabase free plan, which pauses a project after a
 * week without activity. One tiny read of public catalog data per day keeps it
 * awake at no cost. Triggered by a Vercel Cron job (see `vercel.json`);
 * protected by `CRON_SECRET` the same way as the streak-reminder job.
 */
export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && request.headers.get("authorization") !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return NextResponse.json({ ok: true, skipped: "Supabase is not configured" });
  }

  const response = await fetch(`${url}/rest/v1/courses?select=id&limit=1`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
    cache: "no-store",
  });
  return NextResponse.json({ ok: response.ok, status: response.status }, { status: response.ok ? 200 : 502 });
}
