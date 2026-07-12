import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Learn Al Quran Online BD",
    short_name: "Al Quran Online BD",
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
