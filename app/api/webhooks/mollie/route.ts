import { NextResponse } from "next/server";
import { getMollie } from "@/lib/mollie/client";
import { createServiceClient } from "@/lib/supabase/server";
import { createWefactInvoice, wefactConfigured } from "@/lib/wefact/client";
import { notifyPaymentConfirmed } from "@/lib/email/notify";
import { taalVoorRol } from "@/lib/i18n/taal";

/**
 * Mollie roept deze webhook aan met het payment-id. Wij halen de status op,
 * werken de betaling bij en maken bij 'paid' een WeFact-factuur aan.
 *
 * Sinds seizoen 2026/27 bestaan er geen abonnementen meer: de enige online
 * betaling is het schoolreis-project van een school.
 */
export async function POST(request: Request) {
  const mollie = getMollie();
  if (!mollie) return NextResponse.json({ ok: false }, { status: 200 });

  const form = await request.formData();
  const molliePaymentId = String(form.get("id") ?? "");
  if (!molliePaymentId) return NextResponse.json({ ok: false }, { status: 200 });

  const service = createServiceClient();

  try {
    const mopay = await mollie.payments.get(molliePaymentId);

    const { data: payment } = await service
      .from("payments")
      .select("*")
      .eq("mollie_payment_id", molliePaymentId)
      .maybeSingle();
    if (!payment) return NextResponse.json({ ok: true }, { status: 200 });

    // Status synchroniseren.
    const status = String(mopay.status); // open|paid|failed|canceled|expired|pending
    await service.from("payments").update({ status }).eq("id", payment.id);

    if (status === "paid" && payment.status !== "paid") {
      // E-mailadres van de klant ophalen voor bevestiging + factuur.
      const { data: payer } = await service
        .from("users")
        .select("email, role")
        .eq("id", payment.user_id)
        .single();
      if (payer?.email) {
        await notifyPaymentConfirmed(
          payer.email,
          payment.description ?? "je Skimeister-betaling",
          taalVoorRol(payer.role),
        );
      }

      // WeFact-factuur aanmaken.
      if (wefactConfigured() && !payment.wefact_invoice_id) {
        const { data: u } = await service
          .from("users")
          .select("email")
          .eq("id", payment.user_id)
          .single();
        const { data: org } = payment.organization_id
          ? await service
              .from("organizations")
              .select("name")
              .eq("id", payment.organization_id)
              .single()
          : { data: null };

        const invoiceCode = await createWefactInvoice({
          email: u?.email ?? "onbekend@skimeister.nl",
          companyName: org?.name ?? u?.email ?? "Skimeister-klant",
          lines: [
            {
              Description: payment.description ?? "Skimeister",
              PriceExclVat: Number(payment.amount),
              Number: 1,
              TaxPercentage: 21,
            },
          ],
        });
        if (invoiceCode) {
          await service
            .from("payments")
            .update({ wefact_invoice_id: invoiceCode })
            .eq("id", payment.id);
        }
      }
    }
  } catch (e) {
    // Altijd 200 teruggeven zodat Mollie niet blijft herhalen op fouten die
    // wij niet kunnen oplossen; loggen voor diagnose.
    console.error("Mollie webhook error:", e);
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
