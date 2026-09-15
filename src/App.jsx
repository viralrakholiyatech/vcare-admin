import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/auth/Login";
import Welcome from "./pages/auth/Welcome";
import Dashboard from "./pages/dashboard/Dashboard";

import Blogs from "./pages/blogs/Blogs";
import AddBlog from "./pages/blogs/AddBlog";
import EditBlog from "./pages/blogs/EditBlog";

import Projects from "./pages/projects/Projects";
import AddProject from "./pages/projects/AddProject";
import EditProject from "./pages/projects/EditProject";

import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

import "./App.css";

function App() {
    return (
        <Router>
            <Routes>

                {/* LOGIN - Only accessible when NOT logged in */}
                <Route element={<PublicRoute />}>
                    <Route path="/admin/login" element={<Login />} />
                    <Route path="/" element={<Welcome />} />
                </Route>

                {/* ADMIN - Only accessible when logged in */}
                <Route element={<ProtectedRoute />}>

                    <Route
                        path="/admin/dashboard"
                        element={<Dashboard />}
                    />

                    <Route
                        path="/admin/blogs"
                        element={<Blogs />}
                    />

                    <Route
                        path="/admin/blog/add"
                        element={<AddBlog />}
                    />

                    <Route
                        path="/admin/blog/edit/:slug"
                        element={<EditBlog />}
                    />

                    <Route
                        path="/admin/projects"
                        element={<Projects />}
                    />

                    <Route
                        path="/admin/project/add"
                        element={<AddProject />}
                    />

                    <Route
                        path="/admin/project/edit/:slug"
                        element={<EditProject />}
                    />

                </Route>

            </Routes>
        </Router>
    );
}

export default App;