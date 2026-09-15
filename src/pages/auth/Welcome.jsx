import React from "react";
import { Link } from "react-router-dom";

import Logo from "../../../public/images/logo.svg";

const Welcome = () => {
    return (
        <div className="h-screen w-full bg-[#F7F7F8] flex items-center justify-center p-5">

            <div className="bg-white border border-[#ECECEC] shadow-[0_1px_12px_0_#0000001F] rounded-lg p-8 lg:p-10 w-full max-w-[500px] text-center">

                {/* Logo */}
                <div className="mb-6 flex justify-center">
                    <img
                        src={Logo}
                        alt="V Care Technologies"
                        className="w-[180px]"
                    />
                </div>

                {/* Heading */}
                <h1 className="text-[28px] lg:text-[32px] font-semibold text-[#151515] mb-2">
                    Welcome
                </h1>

                {/* Description */}
                <p className="text-[14px] lg:text-[16px] text-[#808080] mb-7">
                    Welcome to V Care Technologies Admin Panel.
                </p>

                {/* Login Button */}
                <Link
                    to="/admin/login"
                    className="inline-flex items-center justify-center bg-[#431f0f] hover:bg-[#32170b] text-white text-[16px] font-semibold rounded-md py-3 px-8 transition-all duration-300"
                >
                    Login
                </Link>

            </div>

        </div>
    );
};

export default Welcome;