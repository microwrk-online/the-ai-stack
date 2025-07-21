// app/api/subscribe/route.ts

export const dynamic = "force-dynamic"; // ✅ THIS IS CRITICAL

import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

// ✅ Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// ✅ Initialize Supabase with Service Role (server-side only)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!, // must be defined in .env.local
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // this is sensitive — server only
);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // ✅ Insert email into Supabase
    const { error: dbError } = await supabase
      .from("subscribers")
      .insert([{ email }]);

    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    // ✅ Send welcome email via Resend
    await resend.emails.send({
      from: "Unplaced University <onboarding@resend.dev>", // 🟡 Make sure this sender is verified
      to: email,
      subject: "🎉 Thanks for subscribing!",
      html: `<p>Hey there! Thanks for subscribing to <strong>Unplaced University</strong>. You're officially in! 🚀</p>`,
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Subscription error:", err);
    return NextResponse.json(
      { error: err.message || "Unknown error" },
      { status: 500 }
    );
  }
}
