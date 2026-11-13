import { InputType, TextInputField } from "@/components/formFields";
import { yupResolver } from "@hookform/resolvers/yup";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { NavLink } from "react-router-dom";
import * as Yup from "yup";

const ForgotPasswordPage = () => {
  const [showModal, setShowModal] = useState(false);

  const ForgotDTO = Yup.object({
    email: Yup.string().email().required("Email is required"),
  });
  const handleContinue = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(ForgotDTO) });
  const submitForm = async () => {
    try {
    } catch (exception) {
      console.log(exception);
    }
  };

  return (
    <>
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
                <img
                  src="/images/logo.svg"
                  alt="Netflix Logo"
                  className="h-10"
                />
              </NavLink>
              <h4 className="mb-3 text-2xl font-semibold text-white ">
                Forgot Password
              </h4>
              <p className="mb-8 text-white/35 text-lg">
                Enter the email address associated with your account and we will
                send you a NavLink to reset your password.
              </p>
            </div>

            <form onSubmit={handleSubmit(submitForm)}>
              <div className="relative mb-8">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Icon icon="mage:email" className="text-xl" />
                </div>
                {/* <input
                  type="email"
                  className="w-full h-14 bg-gray-50 rounded-xl pl-12 pr-4 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter Email"
                /> */}
                <TextInputField
                  type={InputType.EMAIL}
                  name="email"
                  control={control}
                  placeholder="Email"
                  errMsg={errors?.email?.message as string}
                />
              </div>

              <button
                type="button"
                onClick={handleContinue}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-4 px-6 rounded-xl text-lg transition-colors mt-8"
              >
                Continue
              </button>

              <div className="text-center mt-6">
                <NavLink
                  to="/auth/login"
                  className="text-blue-600  hover:underline"
                >
                  Back to Sign In
                </NavLink>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Custom Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full mx-4 relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Icon icon="mage:multiply" className="text-xl" />
            </button>

            <div className="p-10 text-center">
              <div className="mb-8">
                <img
                  //   src="/images/logo.svg"
                  src="/placeholder.svg?height=80&width=80&text=📧"
                  alt="WowDash React Vite"
                  className="mx-auto"
                />
              </div>

              <h6 className="mb-3 text-xl font-semibold text-gray-900">
                Verify your Email
              </h6>
              <p className="text-gray-600 text-sm mb-8">
                Thank you, check your email for instructions to reset your
                password
              </p>

              <button
                type="button"
                onClick={closeModal}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 px-6 rounded-xl text-sm transition-colors mt-8"
              >
                Skip
              </button>

              <div className="mt-8 text-sm">
                <p className="mb-0 text-gray-600">
                  Don't receive an email?{" "}
                  <NavLink
                    to="/resend"
                    className="text-blue-600 font-semibold hover:underline"
                  >
                    Resend
                  </NavLink>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ForgotPasswordPage;
