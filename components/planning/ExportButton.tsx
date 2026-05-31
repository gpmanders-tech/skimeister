"use client";

export interface ExportRow {
  name: string;
  resort: string;
  start: string;
  end: string;
  status: string;
  needed: number | string;
  selected: number;
}

export function ExportButton({ rows }: { rows: ExportRow[] }) {
  function download() {
    const header = ["Project", "Gebied", "Start", "Eind", "Status", "Nodig", "Geselecteerd"];
    const escape = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const csv = [
      header.join(";"),
      ...rows.map((r) =>
        [r.name, r.resort, r.start, r.end, r.status, r.needed, r.selected].map(escape).join(";"),
      ),
    ].join("\r\n");

    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "skimeister-planning.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <button
      type="button"
      onClick={download}
      disabled={rows.length === 0}
      className="rounded-full border border-alpine-200 px-5 py-2.5 text-sm font-medium text-alpine-700 hover:bg-alpine-50 disabled:opacity-50"
    >
      Exporteer CSV
    </button>
  );
}
