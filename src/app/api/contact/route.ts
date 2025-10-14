import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const subject = `Portfolio Inquiry from ${name}`;
    const text = `Name: ${name}\nEmail: ${email}\n\n${message}`;

    const { error } = await resend.emails.send({
      from: "Rashedul Portfolio <onboarding@resend.dev>",
      to: ["rashedulislam.edge@gmail.com"],
      replyTo: email,
      subject,
      text,
    });

    if (error) {
      const msg = (error as any)?.message || "Failed to send";
      const isAuth = /invalid api key|api key is invalid|missing api key/i.test(msg);
      return NextResponse.json({ error: msg }, { status: isAuth ? 401 : 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Unexpected error" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}
