import crypto from "crypto";

type OtpRecord = {
  otpHash: string;
  expiresAt: number;
  attempts: number;
};

const otpStore = new Map<string, OtpRecord>();

export function hashOtp(otp: string) {
  return crypto.createHash("sha256").update(otp).digest("hex");
}

export function saveOtp(email: string, otp: string) {
  otpStore.set(email, {
    otpHash: hashOtp(otp),
    expiresAt: Date.now() + 10 * 60 * 1000,
    attempts: 0,
  });
}

export function verifyStoredOtp(email: string, otp: string) {
  const record = otpStore.get(email);

  if (!record) {
    return {
      success: false,
      message: "OTP not found. Please request a new OTP.",
    };
  }

  if (Date.now() > record.expiresAt) {
    otpStore.delete(email);

    return {
      success: false,
      message: "OTP has expired. Please request a new OTP.",
    };
  }

  if (record.attempts >= 5) {
    otpStore.delete(email);

    return {
      success: false,
      message: "Too many incorrect attempts. Please request a new OTP.",
    };
  }

  const incomingHash = hashOtp(otp);

  if (incomingHash !== record.otpHash) {
    record.attempts += 1;

    return {
      success: false,
      message: `Incorrect OTP. ${5 - record.attempts} attempts remaining.`,
    };
  }

  otpStore.delete(email);

  return {
    success: true,
    message: "OTP verified successfully.",
  };
}