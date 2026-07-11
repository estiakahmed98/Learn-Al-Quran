"use client";

import { waLink } from "@/lib/utils";
import { trackEvent } from "@/components/shared/GoogleAnalytics";

export default function WhatsAppFloat({ whatsapp }: { whatsapp: string }) {
  return (
    <a
      href={waLink(whatsapp, "আসসালামু আলাইকুম, আমি কোর্স সম্পর্কে জানতে চাই।")}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent("whatsapp_click", { location: "floating_button" })}
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg transition hover:scale-105"
    >
      <svg viewBox="0 0 24 24" fill="white" className="h-8 w-8">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.29-1.39a9.87 9.87 0 0 0 4.75 1.21h.01c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2Zm0 18.02h-.01a8.1 8.1 0 0 1-4.13-1.13l-.3-.18-3.14.82.84-3.06-.19-.31a8.08 8.08 0 0 1-1.24-4.35c0-4.48 3.65-8.12 8.14-8.12 2.17 0 4.21.85 5.75 2.39a8.08 8.08 0 0 1 2.38 5.74c0 4.48-3.65 8.2-8.1 8.2Zm4.47-6.13c-.24-.12-1.44-.71-1.66-.79-.22-.08-.39-.12-.55.12-.16.24-.63.79-.78.95-.14.16-.29.18-.53.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.43-1.34-1.67-.14-.24-.01-.37.11-.49.11-.11.24-.29.36-.43.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.32-.75-1.81-.2-.48-.4-.41-.55-.42-.14-.01-.3-.01-.46-.01-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.7 2.6 4.12 3.64.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.44-.59 1.64-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28Z" />
      </svg>
    </a>
  );
}
