import type { Metadata } from "next";
import { RegisterForm } from "./RegisterForm";
import { issueFormToken } from "@/lib/security/formGuard";

export const metadata: Metadata = {
  title: "Account aanmaken",
  description: "Maak een gratis account aan op Skimeister.nl.",
};

// Elk bezoek moet een vers, ondertekend tijdstempel krijgen; de pagina mag
// dus niet statisch gecachet worden.
export const dynamic = "force-dynamic";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  return <RegisterForm formToken={issueFormToken()} next={next} />;
}
