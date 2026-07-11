import { NextResponse } from "next/server";
import { Resend } from "resend";

// You will need to add RESEND_API_KEY to your .env.local file
const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy_key");

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    const origin = request.headers.get("origin") || "https://chrispoparch.com";

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Replace this with your actual verified domain in Resend. 
    // By default, Resend onboarding allows sending from onboarding@resend.dev but only TO the verified email address.
    const fromAddress = process.env.FROM_EMAIL_ADDRESS || "onboarding@resend.dev";

    const data = await resend.emails.send({
      from: `ChrisPop Designs & Innovation <${fromAddress}>`,
      to: [email],
      subject: "Our Services Overview PDF",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #000;">
          <h1 style="font-weight: 300; text-transform: uppercase; letter-spacing: 2px;">ChrisPop Designs & Innovation</h1>
          <p style="line-height: 1.6;">Thank you for your interest in our services.</p>
          <p style="line-height: 1.6;">You can download our full services PDF using the secure link below:</p>
          
          <div style="margin: 40px 0;">
            <a href="${origin}/Services%26Pricing.pdf" style="background: #000; color: #fff; padding: 15px 30px; text-decoration: none; text-transform: uppercase; letter-spacing: 2px; font-size: 12px; display: inline-block;">Download PDF</a>
          </div>
          
          <p style="color: #666; font-size: 12px; margin-top: 60px; border-top: 1px solid #eee; padding-top: 20px;">
            If you did not request this document, please ignore this email.
          </p>
        </div>
      `,
    });

    if (data.error) {
      console.error("Resend API Error:", data.error);
      return NextResponse.json({ error: data.error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error sending PDF email:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
