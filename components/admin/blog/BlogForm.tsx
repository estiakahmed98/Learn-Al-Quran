"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { generateSlug } from "@/lib/utils";
import { createBlog, updateBlog, uploadBlogImage, uploadBlogAd } from "@/app/admin/blog/actions";

interface Blog {
  id: number;
  title: string;
  summary: string;
  content: string;
  date: string | Date;
  author: string;
  image: string;
  ads?: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

const TinyMCEEditor = dynamic(() => import("./TinyMCEEditor"), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] border border-gray-300 rounded-lg p-4">
      Loading editor...
    </div>
  ),
});

interface BlogFormProps {
  blog?: Blog;
  onSuccess?: () => void;
}

export default function BlogForm({ blog, onSuccess }: BlogFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingAdImage, setUploadingAdImage] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    content: "",
    date: new Date().toISOString().split("T")[0],
    author: "",
    image: "",
    ads: "",
  });

  // Generate slug from title
  const slug = generateSlug(formData.title);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (blog) {
      const blogDate =
        typeof blog.date === "string" ? new Date(blog.date) : blog.date;

      setFormData({
        title: blog.title || "",
        summary: blog.summary || "",
        content: blog.content || "",
        date: blogDate.toISOString().split("T")[0],
        author: blog.author || "",
        image: blog.image || "",
        ads: blog.ads || "",
      });
    }
  }, [blog]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (blog) {
        await updateBlog(blog.id, formData);
        toast.success("Blog updated successfully");
      } else {
        await createBlog(formData);
        toast.success("Blog created successfully");
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/admin/blog");
        router.refresh();
      }
    } catch (error) {
      console.error("Error saving blog:", error);
      toast.error(error instanceof Error ? error.message : "Error saving blog");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleContentChange = (content: string) => {
    setFormData((prev) => ({
      ...prev,
      content,
    }));
  };

  // Main image upload → uploadBlogImage Server Action (folder: blogImages)
  const handleImageFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);

      const fd = new FormData();
      fd.append("file", file);

      const data = await uploadBlogImage(fd);

      if (!data.url) {
        console.error("Invalid upload response:", data);
        throw new Error("Invalid upload response: url missing");
      }

      setFormData((prev) => ({
        ...prev,
        image: data.url,
      }));

      toast.success("Image uploaded successfully");
    } catch (err: unknown) {
      console.error("Error uploading image:", err);
      const message =
        err instanceof Error ? err.message : "Error uploading image";
      toast.error(message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAdImageFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingAdImage(true);

      const fd = new FormData();
      fd.append("file", file);

      const data = await uploadBlogAd(fd);

      if (!data.url) {
        console.error("Invalid upload response:", data);
        throw new Error("Invalid upload response: url missing");
      }

      setFormData((prev) => ({
        ...prev,
        ads: data.url,
      }));

      toast.success("Ad image uploaded successfully");
    } catch (err: unknown) {
      console.error("Error uploading ad image:", err);
      const message =
        err instanceof Error ? err.message : "Error uploading ad image";
      toast.error(message);
    } finally {
      setUploadingAdImage(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <h2 className="text-lg font-semibold p-4">
        {blog ? "Edit Blog" : "Create New Blog"}
      </h2>
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter blog title"
          />

          {/* Slug Preview */}
          <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600">Slug:</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">blog/{slug}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="author"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Author *
            </label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter author name"
            />
          </div>

          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Publish Date *
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Summary (optional)
          </label>
          <textarea
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="Write summary or leave empty for auto summary"
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content *
          </label>
          {isClient && (
            <TinyMCEEditor
              initialValue={formData.content}
              onContentChange={handleContentChange}
              height="400px"
            />
          )}
        </div>

        {/* Featured Image (upload + URL) */}
        <div className="space-y-2">
          <Label>Featured Image *</Label>

          {/* Preview */}
          {formData.image && (
            <div className="mb-3 flex items-center gap-4">
              <img
                src={formData.image}
                alt="Blog featured"
                className="w-24 h-24 rounded-md object-cover border"
              />
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, image: "" }))}
                className="text-xs text-red-600 hover:underline"
              >
                Remove image
              </button>
            </div>
          )}

          <label className="inline-flex items-center gap-2 w-fit cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageFileChange}
              disabled={uploadingImage}
            />
            <span className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-blue-200 bg-blue-50 text-sm text-blue-800">
              <Upload className="h-4 w-4" />
              {uploadingImage ? "Uploading..." : "Upload image"}
            </span>
          </label>

          {/* Optional: manual URL input */}
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="Or paste image URL (optional)"
            className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="space-y-2">
          <Label>Advertisement Image (optional)</Label>

          {formData.ads && (
            <div className="mb-3 flex items-center gap-4">
              <img
                src={formData.ads}
                alt="Blog ad"
                className="w-24 h-24 rounded-md object-cover border"
              />
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, ads: "" }))}
                className="text-xs text-red-600 hover:underline"
              >
                Remove ad image
              </button>
            </div>
          )}

          <label className="inline-flex items-center gap-2 w-fit cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAdImageFileChange}
              disabled={uploadingAdImage}
            />
            <span className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-blue-200 bg-blue-50 text-sm text-blue-800">
              <Upload className="h-4 w-4" />
              {uploadingAdImage ? "Uploading..." : "Upload ad image"}
            </span>
          </label>

          <input
            type="text"
            name="ads"
            value={formData.ads}
            onChange={handleChange}
            placeholder="Or paste ad image URL (optional)"
            className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex justify-end space-x-3 pt-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Saving..." : blog ? "Update Blog" : "Create Blog"}
          </button>
        </div>
      </form>
    </div>
  );
}
