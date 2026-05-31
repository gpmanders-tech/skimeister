"use client";

import { useState } from "react";
import { Input, Label, Textarea, Select } from "@/components/ui/form";
import { Button } from "@/components/ui/Button";
import { RESORTS } from "@/lib/constants/resorts";

const TEMPLATES: Record<string, { title: string; party1: string }> = {
  ski_school: { title: "Overeenkomst skischool – skileraar", party1: "Skischool" },
  travel_org: { title: "Overeenkomst reisorganisatie – skileraar", party1: "Reisorganisatie" },
  school_nl: { title: "Overeenkomst school – skileraar", party1: "School" },
};

interface Fields {
  template: string;
  orgName: string;
  instructorName: string;
  resort: string;
  startDate: string;
  endDate: string;
  compensation: string;
  tasks: string;
  place: string;
  date: string;
}

export function ContractGenerator({ defaultOrgName }: { defaultOrgName?: string }) {
  const [f, setF] = useState<Fields>({
    template: "ski_school",
    orgName: defaultOrgName ?? "",
    instructorName: "",
    resort: "",
    startDate: "",
    endDate: "",
    compensation: "",
    tasks: "Lesgeven aan toegewezen groepen volgens rooster.",
    place: "",
    date: new Date().toISOString().slice(0, 10),
  });

  const set = (k: keyof Fields, v: string) => setF((prev) => ({ ...prev, [k]: v }));
  const tpl = TEMPLATES[f.template];
  const resortName = RESORTS.find((r) => r.id === f.resort)?.name ?? "—";

  function printContract() {
    const html = contractHtml(f, tpl.title, tpl.party1, resortName);
    const w = window.open("", "_blank", "width=800,height=900");
    if (!w) return;
    w.document.write(html);
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 300);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Formulier */}
      <div className="space-y-4 rounded-2xl border border-alpine-100 bg-white p-6 shadow-sm">
        <div>
          <Label htmlFor="template">Type contract</Label>
          <Select id="template" value={f.template} onChange={(e) => set("template", e.target.value)}>
            {Object.entries(TEMPLATES).map(([k, v]) => (
              <option key={k} value={k}>{v.title}</option>
            ))}
          </Select>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="orgName">{tpl.party1}</Label>
            <Input id="orgName" value={f.orgName} onChange={(e) => set("orgName", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="instructorName">Skileraar</Label>
            <Input id="instructorName" value={f.instructorName} onChange={(e) => set("instructorName", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="resort">Skigebied</Label>
            <Select id="resort" value={f.resort} onChange={(e) => set("resort", e.target.value)}>
              <option value="">Kies een gebied</option>
              {RESORTS.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
            </Select>
          </div>
          <div>
            <Label htmlFor="compensation">Vergoeding</Label>
            <Input id="compensation" value={f.compensation} onChange={(e) => set("compensation", e.target.value)} placeholder="€ 1.200 + reis & verblijf" />
          </div>
          <div>
            <Label htmlFor="startDate">Van</Label>
            <Input id="startDate" type="date" value={f.startDate} onChange={(e) => set("startDate", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="endDate">Tot</Label>
            <Input id="endDate" type="date" value={f.endDate} onChange={(e) => set("endDate", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="place">Plaats (ondertekening)</Label>
            <Input id="place" value={f.place} onChange={(e) => set("place", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="date">Datum</Label>
            <Input id="date" type="date" value={f.date} onChange={(e) => set("date", e.target.value)} />
          </div>
        </div>
        <div>
          <Label htmlFor="tasks">Taken / afspraken</Label>
          <Textarea id="tasks" value={f.tasks} onChange={(e) => set("tasks", e.target.value)} />
        </div>
        <Button type="button" variant="accent" onClick={printContract}>
          Download / print als PDF
        </Button>
      </div>

      {/* Live preview */}
      <div className="rounded-2xl border border-alpine-100 bg-white p-8 shadow-sm">
        <h3 className="font-display text-lg font-bold text-alpine-900">{tpl.title}</h3>
        <div className="mt-4 space-y-3 text-sm text-alpine-700">
          <p><strong>{tpl.party1}:</strong> {f.orgName || "…"}</p>
          <p><strong>Skileraar:</strong> {f.instructorName || "…"}</p>
          <p><strong>Skigebied:</strong> {resortName}</p>
          <p><strong>Periode:</strong> {f.startDate || "…"} t/m {f.endDate || "…"}</p>
          <p><strong>Vergoeding:</strong> {f.compensation || "…"}</p>
          <p><strong>Taken:</strong> {f.tasks || "…"}</p>
          <p className="pt-3 text-xs text-alpine-400">
            Concept — laat het definitieve contract juridisch controleren.
          </p>
        </div>
      </div>
    </div>
  );
}

function esc(s: string) {
  return s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]!));
}

function contractHtml(f: Fields, title: string, party1: string, resortName: string): string {
  return `<!doctype html><html lang="nl"><head><meta charset="utf-8"><title>${esc(title)}</title>
  <style>
    body{font-family:Georgia,'Times New Roman',serif;color:#111;max-width:720px;margin:40px auto;padding:0 24px;line-height:1.6}
    h1{font-size:22px;border-bottom:2px solid #1b3a6b;padding-bottom:8px;color:#1b3a6b}
    .row{margin:8px 0}.label{font-weight:bold;display:inline-block;width:160px}
    .sig{margin-top:64px;display:flex;justify-content:space-between}
    .sig div{width:45%;border-top:1px solid #333;padding-top:6px;font-size:13px}
    .muted{color:#666;font-size:12px;margin-top:40px}
    @media print{body{margin:0}}
  </style></head><body>
  <h1>${esc(title)}</h1>
  <div class="row"><span class="label">${esc(party1)}:</span>${esc(f.orgName)}</div>
  <div class="row"><span class="label">Skileraar:</span>${esc(f.instructorName)}</div>
  <div class="row"><span class="label">Skigebied:</span>${esc(resortName)}</div>
  <div class="row"><span class="label">Periode:</span>${esc(f.startDate)} t/m ${esc(f.endDate)}</div>
  <div class="row"><span class="label">Vergoeding:</span>${esc(f.compensation)}</div>
  <p style="margin-top:24px"><strong>Taken en afspraken</strong><br>${esc(f.tasks).replace(/\n/g, "<br>")}</p>
  <p style="margin-top:24px">Partijen komen bovenstaande overeen en verklaren zich akkoord met de afspraken in deze overeenkomst.</p>
  <div class="sig">
    <div>${esc(party1)}<br>${esc(f.orgName)}</div>
    <div>Skileraar<br>${esc(f.instructorName)}</div>
  </div>
  <p class="muted">Opgemaakt te ${esc(f.place)} op ${esc(f.date)} · gegenereerd via Skimeister.nl. Laat het definitieve contract juridisch controleren.</p>
  </body></html>`;
}
