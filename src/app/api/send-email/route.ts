import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(
  process.env.RESEND_API_KEY
);

// Test API Route
export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Email API Working",
  });
}

export async function POST(req: Request) {
  try {
    const {
      name,
      mobile,
      email,
      city,
      specialization,
    } = await req.json();

    // Admin Email
    await resend.emails.send({
      from: "OMC Leads <onboarding@resend.dev>",
      to: ["magicabhi1234@gmail.com"],
      subject: "🎓 New MBA Lead Received",
      html: `
        <h2>New MBA Lead Received</h2>

        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Mobile:</strong> ${mobile}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>City:</strong> ${city}</p>
        <p><strong>Specialization:</strong> ${specialization}</p>
      `,
    });

    // User Confirmation Email
    await resend.emails.send({
      from: "Online MBA Colleges <onboarding@resend.dev>",
      to: [email],
      subject: "Thank You For Your Enquiry",
      html: `
        <h2>Thank You ${name}</h2>

        <p>
          We have received your enquiry for
          <strong>${specialization}</strong>.
        </p>

        <p>
          Our MBA counsellor will contact you shortly.
        </p>

        <br />

        <p>
          Regards,<br />
          Online MBA Colleges Team
        </p>
      `,
    });

    return NextResponse.json({
      success: true,
      message: "Emails sent successfully",
    });
  } catch (error) {
    console.error("EMAIL ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Email sending failed",
        error,
      },
      {
        status: 500,
      }
    );
  }
}