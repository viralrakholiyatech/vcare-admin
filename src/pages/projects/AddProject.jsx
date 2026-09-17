import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

import Layout from "../../components/Layout";
import { IoArrowBack } from "react-icons/io5";

const AddProject = () => {
    const navigate = useNavigate();

    const [imagePreview, setImagePreview] = useState(null);
    const [bgImagePreview, setBgImagePreview] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        control,
        setValue,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            title: "",
            alias: "",
            short_title: "",
            description: "",
            service_text: "",
            is_home: "0",
            service_id: "",
            site_url: "",
            android_url: "",
            ios_url: "",
            long_description: "",
            meta_title: "",
            meta_description: "",
            image: null,
            background_image: null,
            logo_image: null,
        },
    });

    // ================= RESET FORM =================
    const handleReset = () => {
        reset({
            title: "",
            alias: "",
            short_title: "",
            description: "",
            service_text: "",
            is_home: "0",
            service_id: "",
            site_url: "",
            android_url: "",
            ios_url: "",
            long_description: "",
            meta_title: "",
            meta_description: "",
            image: null,
            background_image: null,
            logo_image: null,
        });

        setImagePreview(null);
        setBgImagePreview(null);
        setLogoPreview(null);

        const imgInput = document.getElementById("project-image");
        const bgInput = document.getElementById("project-bg-image");
        const logoInput = document.getElementById("project-logo-image");

        if (imgInput) imgInput.value = "";
        if (bgInput) bgInput.value = "";
        if (logoInput) logoInput.value = "";
    };

    // ================= QUILL TOOLBAR =================
    const modules = {
        toolbar: [
            ["bold", "italic", "underline"],
            ["link", "image"],
            [{ list: "bullet" }, { list: "ordered" }],
            ["blockquote"],
        ],
    };

    // ================= QUILL VALIDATION =================
    const validateEditor = (value) => {
        const text = value
            ?.replace(/<(.|\n)*?>/g, "")
            .replace(/&nbsp;/g, "")
            .trim();

        return text ? true : "This field is required";
    };

    // ================= SUBMIT =================
    const onSubmit = async (data) => {
        console.log("Project Data:", data);

        setLoading(true);

        try {
            const token = localStorage.getItem("adminToken");

            const formData = new FormData();
            formData.append("title", data.title || "");
            formData.append("alias", data.alias || "");
            formData.append("short_title", data.short_title || "");
            formData.append("description", data.description || "");
            formData.append("service_text", data.service_text || "");
            formData.append("is_home", data.is_home || "0");
            formData.append("service_id", data.service_id || "");
            formData.append("services_id", data.service_id || "");
            formData.append("site_url", data.site_url || "");
            formData.append("android_url", data.android_url || "");
            formData.append("ios_url", data.ios_url || "");
            formData.append("long_description", data.long_description || "");
            formData.append("meta_title", data.meta_title || "");
            formData.append("meta_description", data.meta_description || "");

            if (data.image) {
                formData.append("image", data.image);
            }
            if (data.background_image) {
                formData.append("background_image", data.background_image);
            }
            if (data.logo_image) {
                formData.append("logo_image", data.logo_image);
                formData.append("logo", data.logo_image);
            }

            if (!token) {
                throw new Error("Authorization token missing. Please log in first.");
            }

            const response = await fetch("/api/addproject", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const text = await response.text();
            let result = {};
            try {
                result = text ? JSON.parse(text) : {};
            } catch (e) {
                console.warn("Could not parse JSON response:", text);
            }
            console.log("Add Project Response:", result);

            if (!response.ok || result.error || result.status === false) {
                throw new Error(
                    result.messages || result.message || (text && text.length < 200 ? text : `Server error (${response.status})`)
                );
            }

            setLoading(false);

            await Swal.fire({
                toast: true,
                position: "top-end",
                icon: "success",
                title: result.messages || result.message || "Project added successfully",
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
            });

            navigate("/admin/projects");
        } catch (error) {
            console.error("Add Project Error:", error);
            setLoading(false);

            Swal.fire({
                toast: true,
                position: "top-end",
                icon: "error",
                title: "Failed to add project",
                text: error.message || "Something went wrong. Please try again.",
                showConfirmButton: false,
                timer: 2500,
                timerProgressBar: true,
            });
        }
    };

    return (
        <Layout>
            <div className="main-page-card border border-[#E9EEF2] bg-white rounded-lg lg:p-4 p-3">

                {/* ================= HEADER ================= */}
                <div className="flex items-center gap-3 mb-5">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="h-9 w-9 flex items-center justify-center rounded-md border border-[#E6EAEF] hover:bg-gray-50 transition-all"
                    >
                        <IoArrowBack size={20} />
                    </button>

                    <h2 className="lg:text-[24px] text-[22px] font-semibold text-[#151515]">
                        Add Project
                    </h2>
                </div>

                {/* ================= FORM ================= */}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-12 gap-x-4 gap-y-3">

                        {/* ================= TITLE ================= */}
                        <div className="col-span-12 lg:col-span-4">
                            <div className="input_box pb-3 relative">
                                <p className="mb-1 text-[14px] text-[#151515]">
                                    Title<span className="text-red-500">*</span>
                                </p>
                                <input
                                    type="text"
                                    placeholder="Project Title"
                                    className="w-full py-2.5 px-3 text-[14px] border border-[#E6EAEF] rounded-md outline-none focus:border-[#431f0f]"
                                    {...register("title", {
                                        required: "Enter project title",
                                    })}
                                />
                                {errors.title && (
                                    <p className="absolute bottom-[-7px] text-[12px] text-[#dc3545]">
                                        {errors.title.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* ================= ALIAS ================= */}
                        <div className="col-span-12 lg:col-span-4">
                            <div className="input_box pb-3 relative">
                                <p className="mb-1 text-[14px] text-[#151515]">
                                    Alias<span className="text-red-500">*</span>
                                </p>
                                <input
                                    type="text"
                                    placeholder="Project Alias"
                                    className="w-full py-2.5 px-3 text-[14px] border border-[#E6EAEF] rounded-md outline-none focus:border-[#431f0f]"
                                    {...register("alias", {
                                        required: "Enter project alias",
                                    })}
                                />
                                {errors.alias && (
                                    <p className="absolute bottom-[-7px] text-[12px] text-[#dc3545]">
                                        {errors.alias.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* ================= SHORT TITLE ================= */}
                        <div className="col-span-12 lg:col-span-4">
                            <div className="input_box pb-3">
                                <p className="mb-1 text-[14px] text-[#151515]">
                                    Short Title
                                </p>
                                <input
                                    type="text"
                                    placeholder="Short Title"
                                    className="w-full py-2.5 px-3 text-[14px] border border-[#E6EAEF] rounded-md outline-none focus:border-[#431f0f]"
                                    {...register("short_title")}
                                />
                            </div>
                        </div>

                        {/* ================= SERVICE TEXT ================= */}
                        <div className="col-span-12 lg:col-span-4">
                            <div className="input_box pb-3">
                                <p className="mb-1 text-[14px] text-[#151515]">
                                    Service Text
                                </p>
                                <input
                                    type="text"
                                    placeholder="e.g. UX/UI / Website"
                                    className="w-full py-2.5 px-3 text-[14px] border border-[#E6EAEF] rounded-md outline-none focus:border-[#431f0f]"
                                    {...register("service_text")}
                                />
                            </div>
                        </div>

                        {/* ================= SERVICE ID ================= */}
                        <div className="col-span-12 lg:col-span-4">
                            <div className="input_box pb-3">
                                <p className="mb-1 text-[14px] text-[#151515]">
                                    Service ID
                                </p>
                                <input
                                    type="text"
                                    placeholder="Service ID"
                                    className="w-full py-2.5 px-3 text-[14px] border border-[#E6EAEF] rounded-md outline-none focus:border-[#431f0f]"
                                    {...register("service_id")}
                                />
                            </div>
                        </div>

                        {/* ================= IS HOME ================= */}
                        <div className="col-span-12 lg:col-span-4">
                            <div className="input_box pb-3">
                                <p className="mb-1 text-[14px] text-[#151515]">
                                    Show on Home?
                                </p>
                                <select
                                    className="w-full py-2.5 px-3 text-[14px] border border-[#E6EAEF] rounded-md outline-none focus:border-[#431f0f] bg-white"
                                    {...register("is_home")}
                                >
                                    <option value="0">No</option>
                                    <option value="1">Yes</option>
                                </select>
                            </div>
                        </div>

                        {/* ================= SITE URL ================= */}
                        <div className="col-span-12 lg:col-span-4">
                            <div className="input_box pb-3">
                                <p className="mb-1 text-[14px] text-[#151515]">
                                    Website URL (site_url)
                                </p>
                                <input
                                    type="text"
                                    placeholder="https://example.com"
                                    className="w-full py-2.5 px-3 text-[14px] border border-[#E6EAEF] rounded-md outline-none focus:border-[#431f0f]"
                                    {...register("site_url")}
                                />
                            </div>
                        </div>

                        {/* ================= ANDROID URL ================= */}
                        <div className="col-span-12 lg:col-span-4">
                            <div className="input_box pb-3">
                                <p className="mb-1 text-[14px] text-[#151515]">
                                    Android App URL (android_url)
                                </p>
                                <input
                                    type="text"
                                    placeholder="https://play.google.com/..."
                                    className="w-full py-2.5 px-3 text-[14px] border border-[#E6EAEF] rounded-md outline-none focus:border-[#431f0f]"
                                    {...register("android_url")}
                                />
                            </div>
                        </div>

                        {/* ================= IOS URL ================= */}
                        <div className="col-span-12 lg:col-span-4">
                            <div className="input_box pb-3">
                                <p className="mb-1 text-[14px] text-[#151515]">
                                    iOS App URL (ios_url)
                                </p>
                                <input
                                    type="text"
                                    placeholder="https://apps.apple.com/..."
                                    className="w-full py-2.5 px-3 text-[14px] border border-[#E6EAEF] rounded-md outline-none focus:border-[#431f0f]"
                                    {...register("ios_url")}
                                />
                            </div>
                        </div>

                        {/* ================= MAIN IMAGE ================= */}
                        <div className="col-span-12 lg:col-span-4">
                            <Controller
                                name="image"
                                control={control}
                                render={({ field: { onChange }, fieldState: { error } }) => (
                                    <div className="input_box pb-3 relative">
                                        <p className="mb-1 text-[14px] text-[#151515]">
                                            Main Image (image)
                                        </p>
                                        <input
                                            id="project-image"
                                            type="file"
                                            accept="image/*"
                                            className="w-full py-2 px-3 text-[14px] border border-[#E6EAEF] rounded-md bg-white"
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    onChange(file);
                                                    setImagePreview(URL.createObjectURL(file));
                                                }
                                            }}
                                        />
                                        {error && (
                                            <p className="mt-1 text-[12px] text-[#dc3545]">
                                                {error.message}
                                            </p>
                                        )}
                                        {imagePreview && (
                                            <div className="mt-3 relative w-fit">
                                                <img
                                                    src={imagePreview}
                                                    alt="Project Preview"
                                                    className="w-[140px] h-[85px] object-cover rounded-md border border-[#E6EAEF]"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setImagePreview(null);
                                                        onChange(null);
                                                        const el = document.getElementById("project-image");
                                                        if (el) el.value = "";
                                                    }}
                                                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white text-[16px] flex items-center justify-center hover:bg-red-600"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            />
                        </div>

                        {/* ================= BACKGROUND IMAGE ================= */}
                        <div className="col-span-12 lg:col-span-4">
                            <Controller
                                name="background_image"
                                control={control}
                                render={({ field: { onChange } }) => (
                                    <div className="input_box pb-3 relative">
                                        <p className="mb-1 text-[14px] text-[#151515]">
                                            Background Image
                                        </p>
                                        <input
                                            id="project-bg-image"
                                            type="file"
                                            accept="image/*"
                                            className="w-full py-2 px-3 text-[14px] border border-[#E6EAEF] rounded-md bg-white"
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    onChange(file);
                                                    setBgImagePreview(URL.createObjectURL(file));
                                                }
                                            }}
                                        />
                                        {bgImagePreview && (
                                            <div className="mt-3 relative w-fit">
                                                <img
                                                    src={bgImagePreview}
                                                    alt="Background Preview"
                                                    className="w-[140px] h-[85px] object-cover rounded-md border border-[#E6EAEF]"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setBgImagePreview(null);
                                                        onChange(null);
                                                        const el = document.getElementById("project-bg-image");
                                                        if (el) el.value = "";
                                                    }}
                                                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white text-[16px] flex items-center justify-center hover:bg-red-600"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            />
                        </div>

                        {/* ================= LOGO IMAGE ================= */}
                        <div className="col-span-12 lg:col-span-4">
                            <Controller
                                name="logo_image"
                                control={control}
                                render={({ field: { onChange } }) => (
                                    <div className="input_box pb-3 relative">
                                        <p className="mb-1 text-[14px] text-[#151515]">
                                            Logo Image (logo_image)
                                        </p>
                                        <input
                                            id="project-logo-image"
                                            type="file"
                                            accept="image/*"
                                            className="w-full py-2 px-3 text-[14px] border border-[#E6EAEF] rounded-md bg-white"
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    onChange(file);
                                                    setLogoPreview(URL.createObjectURL(file));
                                                }
                                            }}
                                        />
                                        {logoPreview && (
                                            <div className="mt-3 relative w-fit">
                                                <img
                                                    src={logoPreview}
                                                    alt="Logo Preview"
                                                    className="w-[140px] h-[85px] object-contain rounded-md border border-[#E6EAEF] bg-gray-50 p-1"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setLogoPreview(null);
                                                        onChange(null);
                                                        const el = document.getElementById("project-logo-image");
                                                        if (el) el.value = "";
                                                    }}
                                                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white text-[16px] flex items-center justify-center hover:bg-red-600"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            />
                        </div>

                        {/* ================= DESCRIPTION ================= */}
                        <div className="col-span-12">
                            <div className="input_box pb-4 relative">
                                <p className="mb-1 text-[14px] text-[#151515]">
                                    Short Description<span className="text-red-500">*</span>
                                </p>
                                <Controller
                                    name="description"
                                    control={control}
                                    rules={{
                                        validate: validateEditor,
                                    }}
                                    render={({ field }) => (
                                        <ReactQuill
                                            theme="snow"
                                            modules={modules}
                                            value={field.value || ""}
                                            onChange={field.onChange}
                                            placeholder="Enter short description..."
                                        />
                                    )}
                                />
                                {errors.description && (
                                    <p className="mt-1 text-[12px] text-[#dc3545]">
                                        {errors.description.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* ================= LONG DESCRIPTION ================= */}
                        <div className="col-span-12">
                            <div className="input_box pb-4 relative">
                                <p className="mb-1 text-[14px] text-[#151515]">
                                    Long Description<span className="text-red-500">*</span>
                                </p>
                                <Controller
                                    name="long_description"
                                    control={control}
                                    rules={{
                                        validate: validateEditor,
                                    }}
                                    render={({ field }) => (
                                        <ReactQuill
                                            theme="snow"
                                            modules={modules}
                                            value={field.value || ""}
                                            onChange={field.onChange}
                                            placeholder="Enter detailed project content..."
                                        />
                                    )}
                                />
                                {errors.long_description && (
                                    <p className="mt-1 text-[12px] text-[#dc3545]">
                                        {errors.long_description.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* ================= META TITLE ================= */}
                        <div className="col-span-12">
                            <div className="input_box pb-3">
                                <p className="mb-1 text-[14px] text-[#151515]">
                                    Meta Title
                                </p>
                                <input
                                    type="text"
                                    placeholder="Meta Title"
                                    className="w-full py-2.5 px-3 text-[14px] border border-[#E6EAEF] rounded-md outline-none focus:border-[#431f0f]"
                                    {...register("meta_title")}
                                />
                            </div>
                        </div>

                        {/* ================= META DESCRIPTION ================= */}
                        <div className="col-span-12">
                            <div className="input_box pb-3">
                                <p className="mb-1 text-[14px] text-[#151515]">
                                    Meta Description
                                </p>
                                <textarea
                                    rows={3}
                                    placeholder="Meta Description"
                                    className="w-full py-2.5 px-3 text-[14px] border border-[#E6EAEF] rounded-md outline-none focus:border-[#431f0f] resize-none"
                                    {...register("meta_description")}
                                />
                            </div>
                        </div>

                    </div>

                    {/* ================= BUTTONS ================= */}
                    <div className="flex items-center gap-3 mt-5 justify-end">
                        <button
                            type="button"
                            onClick={handleReset}
                            className="py-2.5 px-5 text-[14px] rounded-md border border-[#E6EAEF] text-[#151515] hover:bg-gray-50 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="py-2.5 px-6 text-[14px] bg-[#431f0f] text-white rounded-md hover:bg-[#32170b] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[100px]"
                        >
                            {loading ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                    Saving...
                                </>
                            ) : (
                                "Submit"
                            )}
                        </button>
                    </div>

                </form>
            </div>
        </Layout>
    );
};

export default AddProject;