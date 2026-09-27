"use client";

import React from "react";

import { useState, useEffect, useRef } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import authSvc from "@/services/auth.service";

interface OTPModalProps {
  resend: boolean;
  isOpen: boolean;
  email: string;
  onVerify: (otp: string) => Promise<void>;
  onResend: () => Promise<void>;
  onClose?: () => void;
  isLoading?: boolean;
  type?: "reset" | "verify";
}

export const OTPModal = ({
  resend,
  isOpen,
  email,
  onVerify,
  onClose,
  isLoading = false,
  type = "verify",
}: OTPModalProps) => {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [canResend, setCanResend] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "failure">("idle");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer for resend
  useEffect(() => {
    if (!isOpen) return;

    if (timeLeft === 0) {
      setCanResend(true);
      return;
    }

    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, isOpen]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value.replace(/[^0-9]/g, "");
    setOtp(newOtp);
    setError("");

    // Move to next input
    if (newOtp[index] && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    try {
      setIsVerifying(true);
      setError("");
      await onVerify(otpString);
      setStatus("success");
      setTimeout(() => {
        onClose?.();
        setStatus("idle");
        setOtp(["", "", "", "", "", ""]);
      }, 2000);
    } catch (err) {
      setStatus("failure");
      setError("Invalid OTP. Please try again.");
      setOtp(["", "", "", "", "", ""]);
      setTimeout(() => {
        setStatus("idle");
      }, 2000);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    try {
      setCanResend(false);
      setTimeLeft(60);
      setOtp(["", "", "", "", "", ""]);
      setError("");
      await authSvc.resendOtp({ email: email });
    } catch (err) {
      setError("Failed to resend OTP. Try again.");
    }
  };

  const hasAutoResentRef = useRef(false);

  useEffect(() => {
    if (!isOpen) return;
    if (!resend) return;
    if (hasAutoResentRef.current) return;

    hasAutoResentRef.current = true;
    (async () => {
      try {
        setCanResend(false);
        setTimeLeft(60);
        setOtp(["", "", "", "", "", ""]);
        setError("");
        await authSvc.resendOtp({ email });
      } catch (err) {
        setError("Failed to resend OTP. Try again.");
      }
    })();
  }, [resend, isOpen, email]);

  if (!isOpen) return null;

  const maskedEmail = `${email.substring(0, 3)}***${email.substring(email.lastIndexOf("@") - 2)}`;

  const isSuccess = status === "success";
  const isFailure = status === "failure";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-[420px] overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0b0c0e] shadow-[0_30px_100px_rgba(0,0,0,0.7)]">
        {/* Subtle top accent */}
        {/* <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-500/60 to-transparent" /> */}

        {/* Close */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.06] bg-white/[0.03] text-white/35 transition-all hover:border-white/[0.12] hover:bg-white/[0.07] hover:text-white"
          >
            <Icon icon="lucide:x" className="text-[16px]" />
          </button>
        )}

        {/* Success State */}
        {isSuccess && (
          <div className="flex min-h-[360px] flex-col items-center justify-center px-7 py-10 text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-400/[0.07]">
              <Icon
                icon="mage:check-circle"
                className="text-[34px] text-emerald-400"
              />
            </div>

            <h2 className="text-xl font-semibold tracking-tight text-white">
              {type === "reset" ? "Code Verified" : "Account Activated"}
            </h2>

            <p className="mt-2 max-w-[280px] text-sm leading-6 text-white/35">
              {type === "reset"
                ? "Your can now proceed to change password!"
                : "Your account has been successfully verified!"}
            </p>
          </div>
        )}

        {/* Failure State */}
        {isFailure && (
          <div className="flex min-h-[360px] flex-col items-center justify-center px-7 py-10 text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-red-400/20 bg-red-400/[0.07]">
              <Icon
                icon="mage:alert-circle"
                className="text-[34px] text-red-400"
              />
            </div>

            <h2 className="text-xl font-semibold tracking-tight text-white">
              Verification Failed
            </h2>

            <p className="mt-2 max-w-[280px] text-sm leading-6 text-white/35">
              The OTP you entered is invalid. Please try again.
            </p>
          </div>
        )}

        {/* Idle State */}
        {status === "idle" && (
          <div className="px-6 py-7 sm:px-8 sm:py-8 ">
            {/* Header */}
            <div className="mb-8 pr-8 ">
              <div className="mb-5 flex h-11 w-11  items-center justify-self-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.035]">
                <Icon icon="mage:email" className="text-[22px] text-center text-white/70" />
              </div>

              <h2 className="text-2xl font-semibold tracking-[-0.02em] text-white text-center">
                {type === "reset" ? "Verify Reset Code" : "Verify Your Email"}
              </h2>

              <p className="mt-2 text-sm leading-6 text-white/35 text-center">
                We've sent a 6-digit code to
                <br />
                <span className="font-medium text-white/65">{maskedEmail}</span>
              </p>
            </div>

            {/* OTP Input Fields */}
            <div className="mb-6">
              <div className="flex justify-between gap-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleBackspace(index, e)}
                    className={`
                    h-14 w-full
                    rounded-xl
                    border
                    bg-[#121316]
                    text-center
                    text-xl
                    font-semibold
                    tracking-wide
                    text-white
                    outline-none
                    transition-all
                    ${error ? "border-gray-500/40" : "border-white/[0.07]"}
                    focus:border-gray-500/50
                    focus:bg-white/[0.045]
                    focus:ring-4
                    focus:ring-red-500/[0.05]
                  `}
                    disabled={isVerifying || isLoading}
                  />
                ))}
              </div>

              {error && (
                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-red-400">
                  <Icon icon="mage:alert-circle" className="text-[15px]" />
                  {error}
                </div>
              )}
            </div>

            {/* Verify Button */}
            <button
              onClick={handleVerify}
              disabled={isVerifying || isLoading || otp.join("").length !== 6}
              className="
              w-full rounded-xl
              bg-[#e50914]
              px-6 py-3.5
              text-sm font-semibold text-white
              transition-all duration-200
              hover:bg-[#f6121d]
              hover:shadow-[0_8px_30px_rgba(229,9,20,0.18)]
              disabled:cursor-not-allowed
              disabled:bg-white/[0.07]
              disabled:text-white/25
              disabled:shadow-none
            "
            >
              {isVerifying || isLoading ? "Verifying..." : "Verify Email"}
            </button>

            {/* Resend OTP */}
            <div className="mt-6 text-center">
              <p className="text-xs sm:text-sm text-white/30">
                {canResend ? (
                  <>
                    Didn't receive the code?{" "}
                    <button
                      onClick={handleResend}
                      className="font-semibold text-white/65 transition-colors hover:text-white"
                      disabled={isVerifying || isLoading}
                    >
                      Resend OTP
                    </button>
                  </>
                ) : (
                  <>
                    Resend code in{" "}
                    <span className="font-semibold text-white/60">
                      {timeLeft}s
                    </span>
                  </>
                )}
              </p>
            </div>

            {/* Security Note */}
            <div className="mt-4  pt-5">
              <div className="flex items-center justify-center text-center gap-2 text-[13px] text-white/20">
                <span>
                  We're keeping your account secure. Please don't share this
                  code with anyone.
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
