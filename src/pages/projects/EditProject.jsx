import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

import Layout from "../../components/Layout";
import { IoArrowBack } from "react-icons/io5";

const EditProject = () => {
    const navigate = useNavigate();
    const { slug } = useParams();

    const [thumbnailPreview, setThumbnailPreview] = useState(null);
    const [bannerPreview, setBannerPreview] = useState(null);

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            projectName: "",
            thumbnail: null,
            category: "",
            shortDescription: "",
            bannerImage: null,
            projectType: "",
            websiteLink: "",
            facebookLink: "",
            instagramLink: "",
            linkedinLink: "",
            androidAppLink: "",
            iosAppLink: "",
            projectContent: "",
            metaTitle: "",
            metaDescription: "",
            slug: "",
        },
    });

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

    // ================= FETCH PROJECT =================
    useEffect(() => {
        const fetchProject = async () => {
            setFetching(true);

            try {
                // Dummy API
                const response = await fetch(
                    `https://jsonplaceholder.typicode.com/posts/${slug}`
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch project");
                }

                const result = await response.json();

                console.log("Project API Response:", result);

                /*
                 * JSONPlaceholder doesn't have project fields.
                 * We are mapping the dummy response into our
                 * project form fields.
                 */

                reset({
                    projectName: result.title || "Demo Project",
                    thumbnail: null,
                    category: "Website",
                    shortDescription:
                        "<p>This is a demo short description for the project.</p>",
                    bannerImage: null,
                    projectType: "UX/UI / Website",
                    websiteLink: "https://example.com",
                    facebookLink: "https://facebook.com/",
                    instagramLink: "https://instagram.com/",
                    linkedinLink: "https://linkedin.com/",
                    androidAppLink: "https://play.google.com/",
                    iosAppLink: "https://apps.apple.com/",
                    projectContent:
                        `<p>${result.body || "This is demo project content."}</p>`,
                    metaTitle: result.title || "Demo Project",
                    metaDescription:
                        "This is a demo project meta description.",
                    slug: slug || "",
                });

                /*
                 * Dummy existing images.
                 *
                 * Replace these URLs later with the actual
                 * image URLs returned by your API.
                 */
                setThumbnailPreview(
                    "https://picsum.photos/300/180?random=10"
                );

                setBannerPreview(
                    "https://picsum.photos/1000/400?random=20"
                );

            } catch (error) {
                console.error("Fetch Project Error:", error);

                Swal.fire({
                    toast: true,
                    position: "top-end",
                    icon: "error",
                    title: "Failed to load project",
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: true,
                });

                navigate("/admin/projects");
            } finally {
                setFetching(false);
            }
        };

        fetchProject();
    }, [slug, reset, navigate]);

    // ================= RESET FORM =================
    const handleReset = () => {
        reset({
            projectName: "",
            thumbnail: null,
            category: "",
            shortDescription: "",
            bannerImage: null,
            projectType: "",
            websiteLink: "",
            facebookLink: "",
            instagramLink: "",
            linkedinLink: "",
            androidAppLink: "",
            iosAppLink: "",
            projectContent: "",
            metaTitle: "",
            metaDescription: "",
            slug: "",
            status: "active",
        });

        setThumbnailPreview(null);
        setBannerPreview(null);

        const thumbnailInput =
            document.getElementById("thumbnail-image");

        const bannerInput =
            document.getElementById("banner-image");

        if (thumbnailInput) {
            thumbnailInput.value = "";
        }

        if (bannerInput) {
            bannerInput.value = "";
        }
    };

    // ================= SUBMIT / UPDATE =================
    const onSubmit = async (data) => {
        console.log("Updated Project Data:", data);

        setLoading(true);

        try {
            /*
             * Dummy PUT API
             *
             * In real API, you will send FormData because
             * thumbnail and bannerImage are files.
             */

            const response = await fetch(
                `https://jsonplaceholder.typicode.com/posts/${slug}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        id: slug,
                        title: data.projectName,
                        body: data.projectContent,
                        category: data.category,
                        shortDescription: data.shortDescription,
                        projectType: data.projectType,
                        websiteLink: data.websiteLink,
                        facebookLink: data.facebookLink,
                        instagramLink: data.instagramLink,
                        linkedinLink: data.linkedinLink,
                        androidAppLink: data.androidAppLink,
                        iosAppLink: data.iosAppLink,
                        metaTitle: data.metaTitle,
                        metaDescription: data.metaDescription,
                        slug: data.slug,
                        status: data.status,

                        // Dummy image names
                        thumbnail: data.thumbnail
                            ? data.thumbnail.name
                            : null,

                        bannerImage: data.bannerImage
                            ? data.bannerImage.name
                            : null,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to update project");
            }

            const result = await response.json();

            console.log("Update API Response:", result);

            setLoading(false);

            await Swal.fire({
                toast: true,
                position: "top-end",
                icon: "success",
                title: "Project updated successfully",
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
            });

            navigate("/admin/projects");

        } catch (error) {
            console.error("Update Project Error:", error);

            setLoading(false);

            Swal.fire({
                toast: true,
                position: "top-end",
                icon: "error",
                title: "Something went wrong",
                text: error.message,
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
            });
        }
    };

    // ================= LOADING =================
    if (fetching) {
        return (
            <Layout>
                <div className="main-page-card border border-[#E9EEF2] bg-white rounded-lg lg:p-4 p-3">

                    <div className="flex items-center justify-center min-h-[400px]">

                        <div className="flex flex-col items-center gap-3">

                            <span className="w-8 h-8 border-4 border-[#431f0f] border-t-transparent rounded-full animate-spin"></span>

                            <p className="text-[14px] text-[#808080]">
                                Loading project...
                            </p>

                        </div>

                    </div>

                </div>
            </Layout>
        );
    }

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
                        Edit Project
                    </h2>

                </div>


                {/* ================= FORM ================= */}
                <form onSubmit={handleSubmit(onSubmit)}>

                    <div className="grid grid-cols-12 gap-x-4 gap-y-3">


                        {/* ================= PROJECT NAME ================= */}
                        <div className="col-span-12 lg:col-span-4">

                            <div className="input_box pb-3 relative">

                                <p className="mb-1 text-[14px] text-[#151515]">
                                    Project Name
                                    <span className="text-red-500">*</span>
                                </p>

                                <input
                                    type="text"
                                    placeholder="Project Name"
                                    className="w-full py-2.5 px-3 text-[14px] border border-[#E6EAEF] rounded-md outline-none focus:border-[#431f0f]"
                                    {...register("projectName", {
                                        required: "Enter project name",
                                    })}
                                />

                                {errors.projectName && (
                                    <p className="absolute bottom-[-7px] text-[12px] text-[#dc3545]">
                                        {errors.projectName.message}
                                    </p>
                                )}

                            </div>

                        </div>


                        {/* ================= THUMBNAIL IMAGE ================= */}
                        <div className="col-span-12 lg:col-span-4">

                            <Controller
                                name="thumbnail"
                                control={control}
                                render={({
                                    field: { onChange },
                                    fieldState: { error },
                                }) => (
                                    <div className="input_box pb-3 relative">

                                        <p className="mb-1 text-[14px] text-[#151515]">
                                            Thumbnail Image
                                        </p>

                                        <input
                                            id="thumbnail-image"
                                            type="file"
                                            accept="image/*"
                                            className="w-full py-2 px-3 text-[14px] border border-[#E6EAEF] rounded-md bg-white"
                                            onChange={(e) => {
                                                const file =
                                                    e.target.files[0];

                                                if (file) {
                                                    onChange(file);

                                                    setThumbnailPreview(
                                                        URL.createObjectURL(
                                                            file
                                                        )
                                                    );
                                                }
                                            }}
                                        />

                                        {error && (
                                            <p className="mt-1 text-[12px] text-[#dc3545]">
                                                {error.message}
                                            </p>
                                        )}

                                        {thumbnailPreview && (
                                            <div className="mt-3 relative w-fit">

                                                <img
                                                    src={thumbnailPreview}
                                                    alt="Thumbnail Preview"
                                                    className="w-[150px] h-[90px] object-cover rounded-md border border-[#E6EAEF]"
                                                />

                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setThumbnailPreview(
                                                            null
                                                        );

                                                        onChange(null);

                                                        const input =
                                                            document.getElementById(
                                                                "thumbnail-image"
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


                        {/* ================= CATEGORY ================= */}
                        <div className="col-span-12 lg:col-span-4">

                            <div className="input_box pb-3 relative">

                                <p className="mb-1 text-[14px] text-[#151515]">
                                    Category
                                    <span className="text-red-500">*</span>
                                </p>

                                <input
                                    type="text"
                                    placeholder="Project Category"
                                    className="w-full py-2.5 px-3 text-[14px] border border-[#E6EAEF] rounded-md outline-none focus:border-[#431f0f]"
                                    {...register("category", {
                                        required: "Enter category",
                                    })}
                                />

                                {errors.category && (
                                    <p className="absolute bottom-[-7px] text-[12px] text-[#dc3545]">
                                        {errors.category.message}
                                    </p>
                                )}

                            </div>

                        </div>


                        {/* ================= SHORT DESCRIPTION ================= */}
                        <div className="col-span-12">

                            <div className="input_box pb-4 relative">

                                <p className="mb-1 text-[14px] text-[#151515]">
                                    Short Description
                                    <span className="text-red-500">*</span>
                                </p>

                                <Controller
                                    name="shortDescription"
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

                                {errors.shortDescription && (
                                    <p className="mt-1 text-[12px] text-[#dc3545]">
                                        {errors.shortDescription.message}
                                    </p>
                                )}

                            </div>

                        </div>


                        {/* ================= BANNER IMAGE ================= */}
                        <div className="col-span-12 lg:col-span-7">

                            <Controller
                                name="bannerImage"
                                control={control}
                                render={({
                                    field: { onChange },
                                    fieldState: { error },
                                }) => (
                                    <div className="input_box pb-3 relative">

                                        <p className="mb-1 text-[14px] text-[#151515]">
                                            Banner Image
                                        </p>

                                        <input
                                            id="banner-image"
                                            type="file"
                                            accept="image/*"
                                            className="w-full py-2 px-3 text-[14px] border border-[#E6EAEF] rounded-md bg-white"
                                            onChange={(e) => {
                                                const file =
                                                    e.target.files[0];

                                                if (file) {
                                                    onChange(file);

                                                    setBannerPreview(
                                                        URL.createObjectURL(
                                                            file
                                                        )
                                                    );
                                                }
                                            }}
                                        />

                                        {error && (
                                            <p className="mt-1 text-[12px] text-[#dc3545]">
                                                {error.message}
                                            </p>
                                        )}

                                        {bannerPreview && (
                                            <div className="mt-3 relative w-fit">

                                                <img
                                                    src={bannerPreview}
                                                    alt="Banner Preview"
                                                    className="w-[220px] h-[100px] object-cover rounded-md border border-[#E6EAEF]"
                                                />

                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setBannerPreview(
                                                            null
                                                        );

                                                        onChange(null);

                                                        const input =
                                                            document.getElementById(
                                                                "banner-image"
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


                        {/* ================= PROJECT TYPE ================= */}
                        <div className="col-span-12 lg:col-span-5">

                            <div className="input_box pb-3 relative">

                                <p className="mb-1 text-[14px] text-[#151515]">
                                    Project Type / Services
                                    <span className="text-red-500">*</span>
                                </p>

                                <input
                                    type="text"
                                    placeholder="UX/UI / Website / Mobile App"
                                    className="w-full py-2.5 px-3 text-[14px] border border-[#E6EAEF] rounded-md outline-none focus:border-[#431f0f]"
                                    {...register("projectType", {
                                        required:
                                            "Enter project type / services",
                                    })}
                                />

                                {errors.projectType && (
                                    <p className="absolute bottom-[-7px] text-[12px] text-[#dc3545]">
                                        {errors.projectType.message}
                                    </p>
                                )}

                            </div>

                        </div>


                        {/* ================= WEBSITE LINK ================= */}
                        <div className="col-span-12 lg:col-span-4">

                            <div className="input_box pb-3">

                                <p className="mb-1 text-[14px] text-[#151515]">
                                    Website Link
                                </p>

                                <input
                                    type="text"
                                    placeholder="https://example.com"
                                    className="w-full py-2.5 px-3 text-[14px] border border-[#E6EAEF] rounded-md outline-none focus:border-[#431f0f]"
                                    {...register("websiteLink")}
                                />

                            </div>

                        </div>


                        {/* ================= FACEBOOK LINK ================= */}
                        <div className="col-span-12 lg:col-span-4">

                            <div className="input_box pb-3">

                                <p className="mb-1 text-[14px] text-[#151515]">
                                    Facebook Link
                                </p>

                                <input
                                    type="text"
                                    placeholder="https://facebook.com/"
                                    className="w-full py-2.5 px-3 text-[14px] border border-[#E6EAEF] rounded-md outline-none focus:border-[#431f0f]"
                                    {...register("facebookLink")}
                                />

                            </div>

                        </div>


                        {/* ================= INSTAGRAM LINK ================= */}
                        <div className="col-span-12 lg:col-span-4">

                            <div className="input_box pb-3">

                                <p className="mb-1 text-[14px] text-[#151515]">
                                    Instagram Link
                                </p>

                                <input
                                    type="text"
                                    placeholder="https://instagram.com/"
                                    className="w-full py-2.5 px-3 text-[14px] border border-[#E6EAEF] rounded-md outline-none focus:border-[#431f0f]"
                                    {...register("instagramLink")}
                                />

                            </div>

                        </div>


                        {/* ================= LINKEDIN LINK ================= */}
                        <div className="col-span-12 lg:col-span-4">

                            <div className="input_box pb-3">

                                <p className="mb-1 text-[14px] text-[#151515]">
                                    LinkedIn Link
                                </p>

                                <input
                                    type="text"
                                    placeholder="https://linkedin.com/"
                                    className="w-full py-2.5 px-3 text-[14px] border border-[#E6EAEF] rounded-md outline-none focus:border-[#431f0f]"
                                    {...register("linkedinLink")}
                                />

                            </div>

                        </div>


                        {/* ================= ANDROID APP LINK ================= */}
                        <div className="col-span-12 lg:col-span-4">

                            <div className="input_box pb-3">

                                <p className="mb-1 text-[14px] text-[#151515]">
                                    Android App Link
                                </p>

                                <input
                                    type="text"
                                    placeholder="https://play.google.com/"
                                    className="w-full py-2.5 px-3 text-[14px] border border-[#E6EAEF] rounded-md outline-none focus:border-[#431f0f]"
                                    {...register("androidAppLink")}
                                />

                            </div>

                        </div>


                        {/* ================= IOS APP LINK ================= */}
                        <div className="col-span-12 lg:col-span-4">

                            <div className="input_box pb-3">

                                <p className="mb-1 text-[14px] text-[#151515]">
                                    iOS App Link
                                </p>

                                <input
                                    type="text"
                                    placeholder="https://apps.apple.com/"
                                    className="w-full py-2.5 px-3 text-[14px] border border-[#E6EAEF] rounded-md outline-none focus:border-[#431f0f]"
                                    {...register("iosAppLink")}
                                />

                            </div>

                        </div>


                        {/* ================= PROJECT CONTENT ================= */}
                        <div className="col-span-12">

                            <div className="input_box pb-4 relative">

                                <p className="mb-1 text-[14px] text-[#151515]">
                                    Project Content
                                    <span className="text-red-500">*</span>
                                </p>

                                <Controller
                                    name="projectContent"
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
                                            placeholder="Enter project content..."
                                        />
                                    )}
                                />

                                {errors.projectContent && (
                                    <p className="mt-1 text-[12px] text-[#dc3545]">
                                        {errors.projectContent.message}
                                    </p>
                                )}

                            </div>

                        </div>


                        {/* ================= META TITLE ================= */}
                        <div className="col-span-12 lg:col-span-6">

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


                        {/* ================= SLUG ================= */}
                        <div className="col-span-12 lg:col-span-6">

                            <div className="input_box pb-3">

                                <p className="mb-1 text-[14px] text-[#151515]">
                                    Slug
                                </p>

                                <input
                                    type="text"
                                    placeholder="Slug"
                                    className="w-full py-2.5 px-3 text-[14px] border border-[#E6EAEF] rounded-md outline-none focus:border-[#431f0f]"
                                    {...register("slug")}
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
                                    Updating...
                                </>
                            ) : (
                                "Update"
                            )}
                        </button>

                    </div>

                </form>

            </div>

        </Layout>
    );
};

export default EditProject;