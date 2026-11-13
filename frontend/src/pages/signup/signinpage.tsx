import { useContext, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import authSvc, { UserType } from "@/services/auth.service";
import { AuthContext } from "@/context/auth-context";
import { InputType, TextInputField } from "@/components/formFields";
import { OTPModal } from "@/components/otpModal";
import toast from "react-hot-toast";

import { NavLink, useNavigate } from "react-router-dom";
interface LoginData {
  email: string;
  password: string;
}

const SignInPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { loggedInUser, setLoggedInUser } = useContext(AuthContext) as {
    loggedInUser: any;
    setLoggedInUser: Function;
  };
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [email, setEmail] = useState<string>("user@example.com");
  const [loginData, setLoginData] = useState<LoginData | null>(null);

  console.log(loginData);
  const LoginDTO = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email().required("Email is required"),
    password: Yup.string().required("Password is required"),
    confirmPassword: Yup.string().required("Confirm Password is required"),
  });

  const [loading, setloading] = useState(false);
  if (loggedInUser) {
    navigate("/");
  }
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(LoginDTO) });
  // TOdo : define types
  const submitForm = async (data: {
    email: string;
    password: string;
    name: string;
    confirmPassword: string;
  }) => {
    try {
      setloading(true);
      let payload = {
        name: data.name,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
      };
      let response: UserType = await authSvc.register(payload);

      setEmail(data.email);
      setIsOtpModalOpen(true);
      setLoggedInUser(response);

      setLoginData({
        email: data.email,
        password: data.password,
      });

      toast("Verify email to continue!");
      //redirect to user dashboard
    } catch (exception) {
      const err = exception as any;

      const validationErrors = err?.response?.data?.data;

      if (validationErrors) {
        const firstError = Object.values(validationErrors)[0] as string;

        const formattedError =
          firstError.charAt(0).toUpperCase() + firstError.slice(1);

        toast.error(formattedError);
      } else {
        toast.error(
          err?.response?.data?.message ||
            "Something went wrong. Please try again.",
        );
      }
    } finally {
      setloading(false);
    }
  };

  const handleVerifyOtp = async (otp: string) => {
    try {
      const response = await authSvc.activateUserAccount({
        otp: otp,
        email: email,
      });
      if (response.status === "USER_ACTIVATED") {
        setTimeout(() => {
          setIsOtpModalOpen(false);
        }, 2500);
      }
    } catch (exception) {
      const err = exception as any;
      toast.error(err?.response?.data?.message);
    }
  };

  const handleResendOtp = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (exception) {
      console.log(exception);
    }
  };

  return (
    <section className="min-h-screen bg-[#121316] flex flex-wrap">
      <div className="hidden lg:block lg:w-[62%] relative overflow-hidden">
        <img
          src="/images/bg.jpg"
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
              Sign Up to your Account
            </h4>
            <p className="mb-8 text-white/35 text-lg">
              Welcome back! please enter your detail
            </p>
          </div>

          <form onSubmit={handleSubmit(submitForm)}>
            <div className="relative mb-4">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Icon icon="mage:user" className="text-xl" />
              </div>
              <TextInputField
                name="name"
                type={InputType.TEXT}
                placeholder="Name"
                control={control}
                errMsg={errors?.name?.message as string}
              />
            </div>

            <div className="relative mb-4">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Icon icon="mage:email" className="text-xl" />
              </div>
              <TextInputField
                name="email"
                type={InputType.EMAIL}
                placeholder="Email"
                control={control}
                errMsg={errors?.email?.message as string}
              />
            </div>

            <div className="relative mb-5">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Icon icon="solar:lock-password-outline" className="text-xl" />
              </div>
              <TextInputField
                name="password"
                type={showPassword ? InputType.TEXT : InputType.PASSWORD}
                placeholder="Password"
                control={control}
                errMsg={errors?.password?.message as string}
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                <Icon
                  icon={showPassword ? "ri:eye-off-line" : "ri:eye-line"}
                  className="text-xl"
                />
              </button>
            </div>
            <div className="relative mb-5">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Icon icon="solar:lock-password-outline" className="text-xl" />
              </div>
              <TextInputField
                name="confirmPassword"
                type={showPassword ? InputType.TEXT : InputType.PASSWORD}
                placeholder="Confirm Password"
                control={control}
                errMsg={errors?.confirmPassword?.message as string}
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                <Icon
                  icon={showPassword ? "ri:eye-off-line" : "ri:eye-line"}
                  className="text-xl"
                />
              </button>
            </div>

            <p className="text-sm text-gray-500 mb-2">
              Your password must have at least 8 characters
            </p>

            <div className="">
              <div className="flex items-start gap-3">
                <input
                  className="mt-1 w-4 h-4 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  type="checkbox"
                  id="terms"
                />
                <label className="text-sm text-gray-600" htmlFor="terms">
                  By creating an account means you agree to the{" "}
                  <NavLink to="#" className="text-blue-600 hover:underline">
                    Terms & Conditions
                  </NavLink>{" "}
                  and our{" "}
                  <NavLink to="#" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </NavLink>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-4 px-6 rounded-xl text-lg transition-colors mt-8"
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full h-px bg-white/[0.07]" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 bg-[#0b0c0e] text-[14px] uppercase tracking-wider text-white/20">
                  or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3">
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

            <div className="mt-4 text-center text-sm">
              <p className="mb-0 text-gray-600">
                Already have an account?{" "}
                <NavLink
                  to="/auth/login"
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Sign In
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

export default SignInPage;
