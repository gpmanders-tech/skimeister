"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const KEY = "skimeister-cookie-consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setVisible(true);
    } catch {
      // localStorage niet beschikbaar — banner overslaan.
    }
  }, []);

  function decide(choice: "accepted" | "rejected") {
    try {
      localStorage.setItem(KEY, choice);
    } catch {
      /* negeren */
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-alpine-100 bg-white/95 p-4 shadow-lg backdrop-blur">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-3 sm:flex-row sm:justify-between">
        <p className="text-sm text-alpine-700">
          We gebruiken alleen functionele cookies om het platform te laten werken. Lees meer in
          ons{" "}
          <Link href="/privacy" className="font-medium text-piste-600 hover:underline">
            privacybeleid
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            onClick={() => decide("rejected")}
            className="rounded-full border border-alpine-200 px-4 py-2 text-sm font-medium text-alpine-700 hover:bg-alpine-50"
          >
            Alleen noodzakelijke
          </button>
          <button
            onClick={() => decide("accepted")}
            className="rounded-full bg-piste-500 px-4 py-2 text-sm font-medium text-white hover:bg-piste-600"
          >
            Akkoord
          </button>
        </div>
      </div>
    </div>
  );
}
