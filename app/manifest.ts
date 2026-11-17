import type { MetadataRoute } from "next";
import { siteName } from "@/lib/site-config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteName,
    short_name: siteName,
    description: "Online Quran, Tajweed and Hifz classes with certified teachers.",
    start_url: "/",
    display: "standalone",
    background_color: "#FAFAFA",
    theme_color: "#28504F",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" }
    ]
  };
}
