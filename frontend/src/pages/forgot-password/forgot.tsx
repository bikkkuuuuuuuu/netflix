"use client"

import { Icon } from "@iconify/react/dist/iconify.js"
import { useState } from "react"
import { NavLink } from "react-router-dom"

const ForgotPasswordPage = () => {
    const [showModal, setShowModal] = useState(false)

    const handleContinue = () => {
        setShowModal(true)
    }

    const closeModal = () => {
        setShowModal(false)
    }

    return (
        <>
            <section className="min-h-screen bg-gray-50 flex flex-wrap">
                <div className="hidden lg:block lg:w-1/2">
                    <div className="flex items-center flex-col h-full justify-center">
                        <img
                            src="https://wowdash.pixcelsthemes.com/wowdash-bootstrap/WowDash/wowdash/assets/images/auth/forgot-pass-img.png"
                            alt="ECA Nepal"
                            className="max-w-full h-auto"
                        />
                    </div>
                </div>

                <div className="w-full lg:w-1/2 py-8 px-6 flex flex-col justify-center">
                    <div className="max-w-md mx-auto w-full">
                        <div className="mb-8">
                            <h4 className="mb-3 text-2xl font-semibold text-gray-900">Forgot Password</h4>
                            <p className="mb-8 text-gray-600 text-lg">
                                Enter the email address associated with your account and we will send you a NavLink to reset your password.
                            </p>
                        </div>

                        <form>
                            <div className="relative mb-8">
                                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    <Icon icon="mage:email" className="text-xl" />
                                </div>
                                <input
                                    type="email"
                                    className="w-full h-14 bg-gray-50 rounded-xl pl-12 pr-4 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter Email"
                                />
                            </div>

                            <button
                                type="button"
                                onClick={handleContinue}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 px-6 rounded-xl text-sm transition-colors mt-8"
                            >
                                Continue
                            </button>

                            <div className="text-center mt-6">
                                <NavLink to="/sign-in" className="text-blue-600 font-bold hover:underline">
                                    Back to Sign In
                                </NavLink>
                            </div>

                            <div className="mt-32 text-center text-sm">
                                <p className="mb-0 text-gray-600">
                                    Already have an account?{" "}
                                    <NavLink to="/sign-in" className="text-blue-600 font-semibold hover:underline">
                                        Sign In
                                    </NavLink>
                                </p>
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
                                <img src="/placeholder.svg?height=80&width=80&text=📧" alt="WowDash React Vite" className="mx-auto" />
                            </div>

                            <h6 className="mb-3 text-xl font-semibold text-gray-900">Verify your Email</h6>
                            <p className="text-gray-600 text-sm mb-8">
                                Thank you, check your email for instructions to reset your password
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
                                    <NavLink to="/resend" className="text-blue-600 font-semibold hover:underline">
                                        Resend
                                    </NavLink>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default ForgotPasswordPage
