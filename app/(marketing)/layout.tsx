import Script from "next/script";
import { SiteHeader } from "@/components/marketing/SiteHeader";
import { SiteFooter } from "@/components/marketing/SiteFooter";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      {/* Meister Max, de chatbot van de Customer Service Agent (alleen op de publieke pagina's, niet in het dashboard) */}
      <Script
        src="https://klantenservice-chi.vercel.app/widget.js"
        data-project="SKI"
        strategy="lazyOnload"
      />
    </>
  );
}
