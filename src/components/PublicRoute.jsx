import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
    const token = localStorage.getItem("adminToken");

    if (token) {
        return <Navigate to="/admin/dashboard" replace />;
    }

    return <Outlet />;
};

export default PublicRoute;