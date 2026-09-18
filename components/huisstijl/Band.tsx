/**
 * Lopende band met woorden. Puur decoratief, dus voor schermlezers verborgen.
 * Bij "beperk beweging" staat de animatie uit (zie globals.css).
 */
export function Band({
  woorden,
  kleur = 'bg-vlam-400 text-inkt',
  hoek = '-rotate-2',
}: {
  woorden: string[]
  kleur?: string
  hoek?: string
}) {
  const rij = [...woorden, ...woorden]

  return (
    <div aria-hidden="true" className={`relative z-10 overflow-hidden ${hoek} ${kleur} py-3`}>
      <div className="band-inhoud flex w-max gap-8 whitespace-nowrap text-lg font-extrabold uppercase tracking-wider">
        {rij.map((woord, i) => (
          <span key={`${woord}-${i}`} className="flex items-center gap-8">
            {woord}
            <span className="text-2xl leading-none">●</span>
          </span>
        ))}
      </div>
    </div>
  )
}
