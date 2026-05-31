/**
 * 25 skigebieden — selecteerbaar op alle profielen en projecten.
 * Elk gebied krijgt een SEO-pagina op /skigebied/[slug].
 */

export type ResortCountry = "Oostenrijk" | "Zwitserland" | "Frankrijk";

export interface Resort {
  id: string;
  slug: string;
  name: string;
  country: ResortCountry;
}

export const RESORTS: Resort[] = [
  // 🇦🇹 Oostenrijk (20)
  { id: "st-anton", slug: "st-anton-am-arlberg", name: "St. Anton am Arlberg", country: "Oostenrijk" },
  { id: "kitzbuehel", slug: "kitzbuehel", name: "Kitzbühel", country: "Oostenrijk" },
  { id: "ischgl", slug: "ischgl", name: "Ischgl", country: "Oostenrijk" },
  { id: "soelden", slug: "soelden", name: "Sölden", country: "Oostenrijk" },
  { id: "mayrhofen", slug: "mayrhofen", name: "Mayrhofen", country: "Oostenrijk" },
  { id: "zell-am-see", slug: "zell-am-see-kaprun", name: "Zell am See / Kaprun", country: "Oostenrijk" },
  { id: "saalbach", slug: "saalbach-hinterglemm", name: "Saalbach-Hinterglemm", country: "Oostenrijk" },
  { id: "schladming", slug: "schladming-ski-amade", name: "Schladming / Ski Amadé", country: "Oostenrijk" },
  { id: "lech-zuers", slug: "lech-zuers-am-arlberg", name: "Lech / Zürs am Arlberg", country: "Oostenrijk" },
  { id: "obertauern", slug: "obertauern", name: "Obertauern", country: "Oostenrijk" },
  { id: "flachau", slug: "flachau-snow-space-salzburg", name: "Flachau / Snow Space Salzburg", country: "Oostenrijk" },
  { id: "montafon", slug: "montafon", name: "Montafon", country: "Oostenrijk" },
  { id: "stubaier", slug: "stubaier-gletscher", name: "Stubaier Gletscher", country: "Oostenrijk" },
  { id: "obergurgl", slug: "obergurgl-hochgurgl", name: "Obergurgl / Hochgurgl", country: "Oostenrijk" },
  { id: "zillertal-arena", slug: "zillertal-arena", name: "Zillertal Arena", country: "Oostenrijk" },
  { id: "alpbach", slug: "alpbach-wildschoenau", name: "Alpbach / Wildschönau", country: "Oostenrijk" },
  { id: "bad-gastein", slug: "bad-gastein-bad-hofgastein", name: "Bad Gastein / Bad Hofgastein", country: "Oostenrijk" },
  { id: "wagrain", slug: "wagrain-kleinarl", name: "Wagrain / Kleinarl", country: "Oostenrijk" },
  { id: "skicircus", slug: "skicircus-saalbach-hinterglemm-leogang", name: "Skicircus Saalbach Hinterglemm Leogang", country: "Oostenrijk" },
  { id: "kitzsteinhorn", slug: "kitzsteinhorn-kaprun", name: "Kitzsteinhorn (Kaprun)", country: "Oostenrijk" },

  // 🇨🇭 Zwitserland (3)
  { id: "verbier", slug: "verbier", name: "Verbier", country: "Zwitserland" },
  { id: "zermatt", slug: "zermatt", name: "Zermatt", country: "Zwitserland" },
  { id: "davos", slug: "davos-klosters", name: "Davos / Klosters", country: "Zwitserland" },

  // 🇫🇷 Frankrijk (2)
  { id: "trois-vallees", slug: "les-trois-vallees", name: "Les Trois Vallées (Courchevel, Méribel, Val Thorens)", country: "Frankrijk" },
  { id: "val-disere", slug: "val-disere-tignes", name: "Val d'Isère / Tignes", country: "Frankrijk" },
];

export const RESORTS_BY_COUNTRY: Record<ResortCountry, Resort[]> = {
  Oostenrijk: RESORTS.filter((r) => r.country === "Oostenrijk"),
  Zwitserland: RESORTS.filter((r) => r.country === "Zwitserland"),
  Frankrijk: RESORTS.filter((r) => r.country === "Frankrijk"),
};

export const getResortById = (id: string) => RESORTS.find((r) => r.id === id);
export const getResortBySlug = (slug: string) => RESORTS.find((r) => r.slug === slug);
