import { MessageCircle } from "lucide-react";

import { waLink } from "@/lib/shop-data";

export function WhatsappFab() {
  return (
    <a
      href={waLink("Hi Scentlyn, I'd like some help choosing home-care products.")}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with Scentlyn on WhatsApp"
      className="group fixed bottom-5 right-4 z-40 inline-flex items-center gap-2 rounded-full bg-whatsapp px-4 py-3 text-whatsapp-foreground shadow-lift transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:bottom-8 sm:right-8"
    >
      <MessageCircle className="h-5 w-5 shrink-0" />
      <span className="hidden text-sm font-semibold sm:inline">
        Need help choosing? Chat with us
      </span>
      <span className="sr-only sm:hidden">Chat with us on WhatsApp</span>
    </a>
  );
}
