import type { ReactNode } from 'react'

const kleuren = {
  zon: 'bg-zon-400 text-inkt',
  vlam: 'bg-vlam-400 text-inkt',
  zee: 'bg-zee-400 text-inkt',
  wit: 'bg-white text-inkt',
}

/** Schuin geplakt labeltje, zoals een sticker op een skikoffer. */
export function Sticker({
  children,
  kleur = 'zon',
  hoek = '-rotate-3',
  className = '',
}: {
  children: ReactNode
  kleur?: keyof typeof kleuren
  hoek?: string
  className?: string
}) {
  return (
    <span
      className={`kantel inline-flex items-center rounded-lg px-4 py-1.5 text-sm font-extrabold uppercase tracking-wide shadow-lg ${kleuren[kleur]} ${hoek} ${className}`}
    >
      {children}
    </span>
  )
}

/** Ronde sticker, bijvoorbeeld voor een jaartal of een belofte. */
export function RondeSticker({
  boven,
  midden,
  onder,
  className = '',
}: {
  boven?: string
  midden: string
  onder?: string
  className?: string
}) {
  return (
    <span
      className={`kantel flex h-28 w-28 rotate-12 flex-col items-center justify-center rounded-full bg-zon-400 text-center text-inkt shadow-xl ${className}`}
    >
      {boven && <span className="text-[11px] font-bold uppercase leading-tight">{boven}</span>}
      <span className="text-2xl font-black leading-none">{midden}</span>
      {onder && <span className="text-[11px] font-bold uppercase leading-tight">{onder}</span>}
    </span>
  )
}
