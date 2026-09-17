import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

import Layout from "../../components/Layout";
import { IoArrowBack } from "react-icons/io5";

const AddBlog = () => {
    const navigate = useNavigate();

    const [imagePreview, setImagePreview] = useState(null);
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
            date: new Date().toISOString().split("T")[0],
        },
    });
    const handleReset = () => {
        reset({
            title: "",
            alias: "",
            date: new Date().toISOString().split("T")[0],
            user: "",
            description: "",
            longDescription: "",
            metaTitle: "",
            metaDescription: "",
            image: null,
        });

        setImagePreview(null);

        const imageInput = document.getElementById("blog-image");

        if (imageInput) {
            imageInput.value = "";
        }
    };

    // ReactQuill Toolbar
    const modules = {
        toolbar: [
            ["bold", "italic", "underline"],
            ["link", "image"],
            [{ list: "bullet" }, { list: "ordered" }],
            ["blockquote"],
        ],
    };

    // Check Quill editor content
    const validateEditor = (value) => {
        const text = value
            ?.replace(/<(.|\n)*?>/g, "")
            .replace(/&nbsp;/g, "")
            .trim();

        return text ? true : "This field is required";
    };

    // Remove Main Image
    const removeImage = () => {
        setImagePreview(null);

        setValue("image", null, {
            shouldValidate: true,
            shouldDirty: true,
        });

        const imageInput = document.getElementById("blog-image");

        if (imageInput) {
            imageInput.value = "";
        }
    };

    const onSubmit = async (data) => {
        console.log("Blog Data:", data);

        setLoading(true);

        try {
            const token = localStorage.getItem("adminToken");

            const formData = new FormData();
            formData.append("title", data.title || "");
            formData.append("alias", data.alias || "");
            formData.append("date", data.date || "");
            formData.append("blog_date", data.date || "");
            formData.append("user", data.user || "");
            formData.append("username", data.user || "");
            formData.append("description", data.description || "");
            formData.append("longDescription", data.longDescription || "");
            formData.append("long_description", data.longDescription || "");
            formData.append("metaTitle", data.metaTitle || "");
            formData.append("meta_title", data.metaTitle || "");
            formData.append("metaDescription", data.metaDescription || "");
            formData.append("meta_description", data.metaDescription || "");
            formData.append("status", data.status || "active");

            if (data.image) {
                formData.append("image", data.image);
                formData.append("blog_image", data.image);
            }

            const response = await fetch("/api/addblog", {
                method: "POST",
                headers: {
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: formData,
            });

            const result = await response.json();
            console.log("Add Blog Response:", result);

            if (!response.ok || result.error || result.status === false) {
                throw new Error(
                    result.messages || result.message || "Failed to add blog"
                );
            }

            setLoading(false);

            // Show success toast
            await Swal.fire({
                toast: true,
                position: "top-end",
                icon: "success",
                title: result.messages || result.message || "Blog added successfully",
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
            });

            // Redirect after toast disappears
            navigate("/admin/blogs");

        } catch (error) {
            console.error("Add Blog Error:", error);
            setLoading(false);

            Swal.fire({
                toast: true,
                position: "top-end",
                icon: "error",
                title: "Failed to add blog",
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
                        Add Blog
                    </h2>

                </div>


                {/* ================= FORM ================= */}
                <form onSubmit={handleSubmit(onSubmit)}>

                    <div className="grid grid-cols-12 gap-x-4 gap-y-3">

                        {/* ================= TITLE ================= */}
                        <div className="col-span-12 lg:col-span-6">

                            <div className="input_box pb-3 relative">

                                <p className="mb-1 text-[14px] text-[#151515]">
                                    Title<span className="text-red-500">*</span>
                                </p>

                                <input
                                    type="text"
                                    placeholder="Title"
                                    className="w-full py-2.5 px-3 text-[14px] border border-[#E6EAEF] rounded-md outline-none focus:border-[#431f0f]"
                                    {...register("title", {
                                        required: "Enter title",
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
                        <div className="col-span-12 lg:col-span-6">

                            <div className="input_box pb-3 relative">

                                <p className="mb-1 text-[14px] text-[#151515]">
                                    Alias<span className="text-red-500">*</span>
                                </p>

                                <input
                                    type="text"
                                    placeholder="Alias"
                                    className="w-full py-2.5 px-3 text-[14px] border border-[#E6EAEF] rounded-md outline-none focus:border-[#431f0f]"
                                    {...register("alias", {
                                        required: "Enter alias",
                                    })}
                                />

                                {errors.alias && (
                                    <p className="absolute bottom-[-7px] text-[12px] text-[#dc3545]">
                                        {errors.alias.message}
                                    </p>
                                )}

                            </div>

                        </div>


                        {/* ================= DATE ================= */}
                        <div className="col-span-12 lg:col-span-6">
                            <div className="input_box pb-3 relative">

                                <p className="mb-1 text-[14px] text-[#151515]">
                                    Date
                                </p>

                                <input
                                    type="date"
                                    className="w-full py-2.5 px-3 text-[14px] border border-[#E6EAEF] rounded-md outline-none focus:border-[#431f0f]"
                                    {...register("date")}
                                />

                            </div>
                        </div>


                        {/* ================= USER ================= */}
                        <div className="col-span-12 lg:col-span-6">

                            <div className="input_box pb-3 relative">

                                <p className="mb-1 text-[14px] text-[#151515]">
                                    User<span className="text-red-500">*</span>
                                </p>

                                <input
                                    type="text"
                                    placeholder="Username"
                                    className="w-full py-2.5 px-3 text-[14px] border border-[#E6EAEF] rounded-md outline-none focus:border-[#431f0f]"
                                    {...register("user", {
                                        required: "Enter username",
                                    })}
                                />

                                {errors.user && (
                                    <p className="absolute bottom-[-7px] text-[12px] text-[#dc3545]">
                                        {errors.user.message}
                                    </p>
                                )}

                            </div>

                        </div>


                        {/* ================= DESCRIPTION ================= */}
                        <div className="col-span-12">

                            <div className="input_box pb-4 relative">

                                <p className="mb-1 text-[14px] text-[#151515]">
                                    Description<span className="text-red-500">*</span>
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
                                            placeholder="Enter description..."
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
                                    name="longDescription"
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
                                            placeholder="Enter long description..."
                                        />
                                    )}
                                />

                                {errors.longDescription && (
                                    <p className="mt-1 text-[12px] text-[#dc3545]">
                                        {errors.longDescription.message}
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
                                    {...register("metaTitle")}
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
                                    {...register("metaDescription")}
                                />

                            </div>

                        </div>


                        {/* ================= IMAGE ================= */}
                        <div className="col-span-12 lg:col-span-8">

                            <Controller
                                name="image"
                                control={control}
                                rules={{
                                    required: "Select blog image",
                                }}
                                render={({
                                    field: { onChange },
                                    fieldState: { error },
                                }) => (

                                    <div className="input_box pb-3 relative">

                                        <p className="mb-1 text-[14px] text-[#151515]">
                                            Image<span className="text-red-500">*</span>
                                        </p>

                                        <input
                                            id="blog-image"
                                            type="file"
                                            accept="image/*"
                                            className="w-full py-2 px-3 text-[14px] border border-[#E6EAEF] rounded-md bg-white"
                                            onChange={(e) => {

                                                const file = e.target.files[0];

                                                if (file) {

                                                    // Send file to React Hook Form
                                                    onChange(file);

                                                    // Preview
                                                    setImagePreview(
                                                        URL.createObjectURL(file)
                                                    );
                                                }
                                            }}
                                        />

                                        {/* Validation */}
                                        {error && (
                                            <p className="mt-1 text-[12px] text-[#dc3545]">
                                                {error.message}
                                            </p>
                                        )}


                                        {/* Image Preview */}
                                        {imagePreview && (

                                            <div className="mt-4 relative w-fit">

                                                <img
                                                    src={imagePreview}
                                                    alt="Blog Preview"
                                                    className="w-[180px] h-[110px] object-cover rounded-md border border-[#E6EAEF]"
                                                />

                                                {/* Remove Button */}
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setImagePreview(null);
                                                        onChange(null);

                                                        const input =
                                                            document.getElementById(
                                                                "blog-image"
                                                            );

                                                        if (input) {
                                                            input.value = "";
                                                        }
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


                        {/* ================= BUTTONS ================= */}

                    </div>
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

export default AddBlog;