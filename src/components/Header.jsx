import React, { useContext, useState } from "react";
import Logo from "../../public/images/logo.svg";
import { Link, useNavigate } from "react-router-dom";
import { CgMenuGridO } from "react-icons/cg";
import { TbLogout } from "react-icons/tb";
import { SidebarContext } from "../context/sidebarContext";
import Swal from "sweetalert2";

const Header = () => {
    const { openSidebar, setOpenSidebar } = useContext(SidebarContext);

    const navigate = useNavigate();
    const [loggingOut, setLoggingOut] = useState(false);

    // ================= LOGOUT =================
    const handleLogout = async () => {
        const result = await Swal.fire({
            title: "Logout?",
            text: "Are you sure you want to logout?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#431f0f",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Yes, Logout",
            cancelButtonText: "Cancel",
        });

        if (!result.isConfirmed) {
            return;
        }

        setLoggingOut(true);

        try {
            const token = localStorage.getItem("adminToken");

            // Dummy Logout API
            const response = await fetch(
                "https://dummyjson.com/auth/logout",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    credentials: "include",
                }
            );

            const result = await response.json();

            console.log("Logout Response:", result);

            // ================= CLEAR LOGIN DATA =================
            localStorage.removeItem("adminToken");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user");

            setLoggingOut(false);

            // ================= SUCCESS TOAST =================
            await Swal.fire({
                toast: true,
                position: "top-end",
                icon: "success",
                title: "Logout successful",
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: true,
            });

            // ================= REDIRECT =================
            navigate("/admin/login", { replace: true });

        } catch (error) {
            console.error("Logout Error:", error);

            /*
             * Even if dummy API fails,
             * logout locally so user is not stuck.
             */
            localStorage.removeItem("adminToken");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user");

            setLoggingOut(false);

            Swal.fire({
                toast: true,
                position: "top-end",
                icon: "error",
                title: "Logout failed",
                text: "Please try again.",
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
            });
        }
    };

    return (
        <>
            <header className="header border-b border-[#000000] bg-white z-[99] fixed top-0 left-0 right-0 w-full">
                <div className="lg:py-[15px] py-[12px] lg:px-[50px] px-[20px]">
                    <div className="flex items-center justify-between">

                        {/* ================= LEFT ================= */}
                        <div className="logo-part flex items-center gap-20">

                            <Link to="/admin/dashboard">
                                <img
                                    src={Logo}
                                    alt="V Care Technologies"
                                    className="lg:w-[150px] w-[120px]"
                                />
                            </Link>

                            <span
                                className="sm:inline-block hidden cursor-pointer"
                                onClick={() =>
                                    setOpenSidebar(!openSidebar)
                                }
                            >
                                <CgMenuGridO
                                    className="lg:text-[34px] text-[30px] text-[#324054]"
                                />
                            </span>

                        </div>


                        {/* ================= RIGHT ================= */}
                        <div className="right-menus flex lg:gap-5 gap-3 items-center">

                            {/* Logout */}
                            <button
                                type="button"
                                onClick={handleLogout}
                                disabled={loggingOut}
                                className="lg:w-[40px] lg:h-[40px] w-[30px] h-[30px] flex items-center justify-center lg:p-2 p-1.5 cursor-pointer rounded-full bg-[#D309090F] hover:bg-[#D3090915] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loggingOut ? (
                                    <span className="w-4 h-4 lg:w-5 lg:h-5 border-2 border-[#D41E1E] border-t-transparent rounded-full animate-spin"></span>
                                ) : (
                                    <TbLogout className="text-[#D41E1E] lg:text-[26px] text-[20px]" />
                                )}
                            </button>

                        </div>

                    </div>
                </div>
            </header>
        </>
    );
};

export default Header;