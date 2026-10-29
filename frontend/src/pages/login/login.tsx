import { AuthContext } from "@/context/auth-context";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { NavLink, useNavigate } from "react-router-dom";
import authSvc, { UserType } from "@/services/auth.service";
import toast from "react-hot-toast";
import { InputType, TextInputField } from "@/components/formFields";
import { OTPModal } from "@/components/otpModal";

interface LoginData {
  email: string;
  password: string;
}

const LogInPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { loggedInUser, setLoggedInUser } = useContext(AuthContext) as {
    loggedInUser: UserType;
    setLoggedInUser: Function;
  };
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [email, setEmail] = useState<string>("");
  const [loginData, setLoginData] = useState<LoginData | null>(null);

  const LoginDTO = Yup.object({
    email: Yup.string().email().required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const [loading, setloading] = useState(false);
  const navigate = useNavigate();
  if (loggedInUser) {
    navigate("/");
  }
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(LoginDTO) });
  // TOdo : define types
  const submitForm = async (data: { email: string; password: string }) => {
    try {
      setloading(true);

      setEmail(data.email);
      let payload = {
        email: data.email,
        password: data.password,
      };

      setLoginData(payload);
      let response: UserType = await authSvc.login(payload);
      console.log("Check Response :", response);
      toast.success("Logged in successfully!");

      setLoggedInUser(response);
      console.log(loggedInUser);

      navigate("/");
    } catch (exception) {
      const err = exception as any;
      console.log(exception);
      if (err?.response?.data?.status === "USER_NOT_ACTIVE") {
        toast("Verify email to continue");
        setIsOtpModalOpen(true);
      } else {
        toast.error(err?.response?.data?.message);
      }
    } finally {
      setloading(false);
    }
  };

  const handleVerifyOtp = async (otp: string) => {
    try {
      const data = await authSvc.activateUserAccount({
        otp: otp,
        email: email,
      });
      if (data?.status === "USER_ACTIVATED") {
        setTimeout(() => {
          setIsOtpModalOpen(false);
        }, 2000);
      }
      try {
        let response: UserType = await authSvc.login(loginData as LoginData);
        setLoggedInUser(response);
        navigate("/");
      } catch (exception) {
        console.log(exception);
        const err = exception as any;
        toast.error(err?.response?.data?.message);
      }
    } catch (exception) {
      console.log(exception);
    }
  };

  const handleResendOtp = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("OTP Resent to:", email);
    alert("OTP resent successfully!");
  };
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:9005/api/v1/auth/google";
  };
  const handleFacebookLogin = () => {
    window.location.href = "http://localhost:9005/api/v1/auth/facebook";
  };

  return (
    <section className="min-h-screen bg-[#121316] flex flex-wrap">
      <div className="hidden lg:block lg:w-[62%] relative overflow-hidden">
        <img
          src="/images/bg.png"
          alt="Featured content"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/10" />
        <div className=" absolute inset-0 bg-gradient-to-r from-black/5 via-transparent to-[#0b0c0e] " />
        <div className=" absolute inset-0 bg-gradient-to-t from-[#0b0c0e]/70 via-transparent to-transparent " />
      </div>

      <div className="w-full lg:w-[38%] py-8 px-6 sm:px-2 flex flex-col justify-center items-center bg-[#0b0c0e]">
        <div className="max-w-md mx-auto w-full">
          <div className="mb-8">
            <NavLink to="/" className="block mb-10 max-w-72">
              <img src="/images/logo.svg" alt="Netflix Logo" className="h-10" />
            </NavLink>
            <h4 className="mb-3 text-2xl font-semibold text-white ">
              Sign In to your Account
            </h4>
            <p className="mb-8 text-white/35 text-lg">
              Welcome back! please enter your detail
            </p>
          </div>

          <form onSubmit={handleSubmit(submitForm)}>
            <div className="relative mb-4">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Icon icon="mage:email" className="text-xl" />
              </div>

              <TextInputField
                type={InputType.EMAIL}
                name="email"
                control={control}
                placeholder="Email"
                errMsg={errors?.email?.message as string}
              />
            </div>

            <div className="relative mb-5">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Icon icon="solar:lock-password-outline" className="text-xl" />
              </div>

              <TextInputField
                type={showPassword ? InputType.TEXT : InputType.PASSWORD}
                name="password"
                control={control}
                placeholder="Password"
                errMsg={errors?.password?.message as string}
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                <Icon
                  icon={showPassword ? "ri:eye-off-line" : "ri:eye-line"}
                  className="text-xl"
                />
              </button>
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-center gap-2">
                <div className="flex items-center">
                  <input
                    className="w-4 h-4 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 mr-2"
                    type="checkbox"
                    id="remember"
                  />
                  <label className="text-sm text-gray-600" htmlFor="remember">
                    Remember me
                  </label>
                </div>
                <NavLink
                  to="#"
                  className="text-blue-600 font-medium text-sm hover:underline"
                >
                  Forgot Password?
                </NavLink>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-4 px-6 rounded-xl text-lg transition-colors mt-8"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>

            <div className="relative my-7">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full h-px bg-white/[0.07]" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 bg-[#0b0c0e] text-[14px] uppercase tracking-wider text-white/20">
                  or continue with
                </span>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-3">
              <button
                type="button"
                className="flex-1 font-semibold  py-4 px-6 border rounded-xl text-sm flex items-center justify-center gap-3 
                bg-[#121316]  border-white/[0.07] text-white/55   transition-all duration-200 hover:bg-white/[0.05] hover:border-white/[0.12] hover:text-white"
              >
                <Icon
                  icon="ic:baseline-facebook"
                  className="text-blue-600 text-xl"
                />
                Facebook
              </button>
              <button
                type="button"
                className="flex-1 font-semibold  py-4 px-6 border rounded-xl text-sm flex items-center justify-center gap-3 
                bg-[#121316]  border-white/[0.07] text-white/55   transition-all duration-200 hover:bg-white/[0.05] hover:border-white/[0.12] hover:text-white"
              >
                <Icon icon="logos:google-icon" className="text-xl" />
                Google
              </button>
            </div>

            <div className="mt-8 text-center text-sm">
              <p className="mb-0 text-gray-600">
                Don't have an account?
                <NavLink
                  to="/auth/sign-in"
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Sign Up
                </NavLink>
              </p>
            </div>
          </form>
        </div>
      </div>
      <OTPModal
        resend={true}
        isOpen={isOtpModalOpen}
        email={email}
        onVerify={handleVerifyOtp}
        onResend={handleResendOtp}
      />
    </section>
  );
};

export default LogInPage;
