/** Genereert de skiweken (maandag → zondag) voor een seizoen, okt t/m apr. */

export interface SeasonWeek {
  /** Maandag, yyyy-mm-dd */
  start: string;
  /** Zondag, yyyy-mm-dd */
  end: string;
  /** Korte label, bijv. "6 okt". */
  label: string;
  /** Maandnummer 1-12 van de maandag. */
  month: number;
  monthLabel: string;
}

const MONTHS_NL = [
  "jan", "feb", "mrt", "apr", "mei", "jun",
  "jul", "aug", "sep", "okt", "nov", "dec",
];

function iso(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function seasonStartYear(season: string): number {
  return parseInt(season.split("-")[0], 10);
}

export function seasonWeeks(season: string): SeasonWeek[] {
  const startYear = seasonStartYear(season);

  // Start: maandag van de week met 1 oktober.
  const oct1 = new Date(Date.UTC(startYear, 9, 1));
  const day = oct1.getUTCDay(); // 0 zo .. 6 za
  const offsetToMonday = (day + 6) % 7;
  const cursor = new Date(oct1);
  cursor.setUTCDate(oct1.getUTCDate() - offsetToMonday);

  // Eind: 30 april van het volgende jaar.
  const endBoundary = new Date(Date.UTC(startYear + 1, 3, 30));

  const weeks: SeasonWeek[] = [];
  while (cursor <= endBoundary) {
    const start = new Date(cursor);
    const end = new Date(cursor);
    end.setUTCDate(start.getUTCDate() + 6);
    const month = start.getUTCMonth() + 1;
    weeks.push({
      start: iso(start),
      end: iso(end),
      label: `${start.getUTCDate()} ${MONTHS_NL[start.getUTCMonth()]}`,
      month,
      monthLabel: MONTHS_NL[start.getUTCMonth()],
    });
    cursor.setUTCDate(cursor.getUTCDate() + 7);
  }
  return weeks;
}
