import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { saveOtp } from "@/lib/otp-store";

function generateOtp() {
  return crypto.randomInt(100000, 1000000).toString();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = String(body.email || "").trim().toLowerCase();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid email address.",
        },
        { status: 400 }
      );
    }

    const gmailUser = process.env.GMAIL_USER;
    const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;

    if (!gmailUser || !gmailAppPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Gmail configuration is missing.",
        },
        { status: 500 }
      );
    }

    const otp = generateOtp();

    // Save OTP securely in server memory
    saveOtp(email, otp);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: gmailUser,
        pass: gmailAppPassword,
      },
    });

    await transporter.sendMail({
      from: `"StudyPlanner AI" <${gmailUser}>`,
      to: email,
      subject: "StudyPlanner AI - Email Verification OTP",
      text: `Your StudyPlanner AI verification code is ${otp}. This OTP is valid for 10 minutes. Do not share this code with anyone.`,
      html: `
        <div style="font-family:Arial,sans-serif;background:#f1f5f9;padding:40px;">
          <div style="max-width:520px;margin:auto;background:white;padding:32px;border-radius:16px;">
            <h2 style="color:#2563eb;">StudyPlanner AI</h2>

            <p style="color:#475569;">
              Your email verification code is:
            </p>

            <div style="
              font-size:32px;
              font-weight:bold;
              letter-spacing:8px;
              color:#0f172a;
              margin:24px 0;
            ">
              ${otp}
            </div>

            <p style="color:#64748b;">
              This OTP is valid for <strong>10 minutes</strong>.
            </p>

            <p style="color:#94a3b8;font-size:13px;">
              If you did not request this code, you can safely ignore this email.
            </p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully.",
    });
  } catch (error) {
    console.error("SEND OTP ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to send OTP. Please try again.",
      },
      { status: 500 }
    );
  }
}