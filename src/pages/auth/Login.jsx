import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Swal from "sweetalert2";

import Logo from "../../../public/images/logo.svg";

const Login = () => {
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();



    const onSubmit = async (data) => {
        console.log("Login Data:", data);

        setLoading(true);

        try {
            const response = await fetch("https://www.vcaretechnologies.net/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: data.email,
                    password: data.password,
                }),
            });

            const result = await response.json();

            console.log("Login Response:", result);

            if (!response.ok || result.error || !result.token) {
                throw new Error(
                    result.messages || result.message || "Invalid email or password"
                );
            }

            localStorage.setItem("adminToken", result.token);

            if (result.user) {
                localStorage.setItem("user", JSON.stringify(result.user));
            }

            setLoading(false);

            // Show success toast
            Swal.fire({
                toast: true,
                position: "top-end",
                icon: "success",
                title: result.messages || "Login successful",
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
            });

            // Redirect after 2 seconds
            setTimeout(() => {
                navigate("/admin/dashboard");
            }, 2000);

        } catch (error) {
            console.error("Login Error:", error);

            setLoading(false);

            Swal.fire({
                toast: true,
                position: "top-end",
                icon: "error",
                title: "Login failed",
                text: error.message || "Something went wrong. Please try again.",
                showConfirmButton: false,
                timer: 2500,
                timerProgressBar: true,
            });
        }
    };

    return (
        <>
            <div className="main-contact-page lg:p-10 h-screen w-full">
                <div className="inner-contact-form lg:p-0 p-5 rounded-lg h-full flex items-center justify-center">

                    <div className="grid grid-cols-12 w-full">

                        {/* LEFT SPACE */}
                        <div className="lg:col-span-4 lg:block hidden"></div>


                        {/* LOGIN FORM */}
                        <div className="lg:col-span-4 col-span-12">

                            <div className="form-box border border-[#ECECEC] shadow-[0_1px_12px_0_#0000001F] lg:p-5 p-3 rounded-lg bg-white">

                                {/* LOGO */}
                                <div className="lg:mb-5 mb-3">
                                    <img
                                        src={Logo}
                                        alt="V Care Technologies"
                                        className="lg:w-[200px] w-[150px]"
                                    />
                                </div>


                                {/* HEADING */}
                                <div className="lg:pb-7 pb-5">

                                    <h1 className="lg:text-[26px] text-[24px] font-semibold lg:mb-[3px] mb-[1px]">
                                        Welcome Back
                                    </h1>

                                    <p className="lg:text-[18px] text-[16px] text-[#808080]">
                                        Sign in to access your dashboard, Settings and Projects.
                                    </p>

                                </div>
                                {/* FORM */}
                                <form onSubmit={handleSubmit(onSubmit)}>

                                    {/* EMAIL */}
                                    <div className="lg:mb-10 mb-7 relative">

                                        <p className="text-[#3A3A3A] lg:text-[14px] text-[12px] font-medium mb-1">
                                            Email
                                        </p>

                                        <input
                                            type="email"
                                            className="lg:text-[14px] text-[12px] focus:outline-none text-[#909090] w-full lg:py-2 lg:px-4 py-2 px-3 rounded-md bg-[#F7F7F8] placeholder:text-[#667085]"
                                            placeholder="Enter your email"
                                            {...register("email", {
                                                required: "Email is required",
                                                pattern: {
                                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                    message: "Invalid email address",
                                                },
                                            })}
                                        />

                                        {errors.email && (
                                            <p className="absolute lg:bottom-[-20px] bottom-[-15px] left-0 lg:text-[12px] text-[10px] text-[#dc3545]">
                                                {errors.email.message}
                                            </p>
                                        )}

                                    </div>


                                    {/* PASSWORD */}
                                    <div className="lg:mb-10 mb-7 relative">

                                        <p className="text-[#3A3A3A] lg:text-[14px] text-[12px] font-medium mb-1">
                                            Password
                                        </p>

                                        <input
                                            type={showPassword ? "text" : "password"}
                                            className="lg:text-[14px] text-[12px] focus:outline-none text-[#909090] w-full lg:py-2 lg:px-4 py-2 px-3 rounded-md bg-[#F7F7F8] placeholder:text-[#667085] pr-10"
                                            placeholder="Enter your password"
                                            {...register("password", {
                                                required: "Password is required",
                                            })}
                                        />

                                        {/* PASSWORD TOGGLE */}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                            className="absolute top-[36px] right-4 text-[#909090] cursor-pointer"
                                        >
                                            {showPassword ? (
                                                <FaEyeSlash />
                                            ) : (
                                                <FaEye />
                                            )}
                                        </button>

                                        {errors.password && (
                                            <p className="absolute lg:bottom-[-20px] bottom-[-15px] left-0 lg:text-[12px] text-[10px] text-[#dc3545]">
                                                {errors.password.message}
                                            </p>
                                        )}

                                    </div>


                                    {/* LOGIN BUTTON */}
                                    <div>

                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="bg-[#324054] lg:py-3 py-2.5 text-center lg:text-[18px] text-[16px] font-semibold text-white rounded-lg w-full transition duration-400 hover:scale-[1.03] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                                        >

                                            {loading ? (
                                                <>
                                                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                                    Logging in...
                                                </>
                                            ) : (
                                                "Log In"
                                            )}

                                        </button>

                                    </div>

                                </form>

                            </div>

                        </div>


                        {/* RIGHT SPACE */}
                        <div className="lg:col-span-3 lg:block hidden"></div>

                    </div>

                </div>
            </div>
        </>
    );
};

export default Login;