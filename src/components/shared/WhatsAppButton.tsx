import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildWhatsAppLink } from "@/lib/utils";

interface WhatsAppButtonProps {
  phone: string;
  listingTitle: string;
  size?: "sm" | "default" | "lg";
  className?: string;
}

export function WhatsAppButton({ phone, listingTitle, size = "default", className }: WhatsAppButtonProps) {
  const href = buildWhatsAppLink(phone, listingTitle);
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      <Button
        size={size}
        className="w-full bg-[#25D366] hover:bg-[#1ebe5d] text-white gap-2 font-semibold"
      >
        <MessageCircle className="h-5 w-5" />
        Contact via WhatsApp
      </Button>
    </a>
  );
}
