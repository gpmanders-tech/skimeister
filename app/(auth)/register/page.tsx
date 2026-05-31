import type { Metadata } from "next";
import { RegisterForm } from "./RegisterForm";

export const metadata: Metadata = {
  title: "Account aanmaken",
  description: "Maak een gratis account aan op Skimeister.nl.",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
