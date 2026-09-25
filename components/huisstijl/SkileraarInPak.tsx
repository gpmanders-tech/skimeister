/**
 * Illustratie: een skileraar in het zwarte Skimeister-pak, achterkant en
 * voorkant. Op de rug onderaan het woordmerk met de drie strepen, op de borst
 * het rondje met de "s" (zoals op de echte pakken). Puur SVG, geen foto.
 */

const PAK = "#121110";
const BROEK = "#1b1917";
const HELM = "#2a2826";
const LAARS = "#3a3633";
const CREME = "#faf6ee";
const ORANJE = "#ff6b35";
const AMBER = "#ffb347";
const INKT = "#0b0a09";
const HUID = "#e9b48f";
const titan = { fontFamily: "var(--font-titan), sans-serif" };

/** Het rondje van de borst: zwart, crème "s", oranje en amber streep. */
export function BorstBadge({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} role="img" aria-label="Skimeister-badge">
      <circle cx="50" cy="50" r="48" fill={INKT} />
      <text x="50" y="58" textAnchor="middle" fontSize="54" fill={CREME} style={titan}>
        s
      </text>
      <rect x="27" y="66" width="46" height="6" rx="3" fill={ORANJE} />
      <rect x="27" y="76" width="46" height="6" rx="3" fill={AMBER} />
    </svg>
  );
}

/** Eén figuur, getekend rond x=210 met de voeten op y=495. */
function Figuur({ kant }: { kant: "voor" | "achter" }) {
  return (
    <g>
      {/* ski's */}
      <rect x="118" y="495" width="184" height="8" rx="4" fill={ORANJE} />
      <rect x="128" y="505" width="184" height="8" rx="4" fill="#e85420" />
      {/* stokken */}
      <line x1="126" y1="300" x2="104" y2="500" stroke={INKT} strokeWidth="4" strokeLinecap="round" />
      <line x1="294" y1="300" x2="316" y2="500" stroke={INKT} strokeWidth="4" strokeLinecap="round" />
      {/* benen en schoenen */}
      <rect x="172" y="325" width="34" height="152" rx="13" fill={BROEK} />
      <rect x="214" y="325" width="34" height="152" rx="13" fill={BROEK} />
      <rect x="168" y="466" width="42" height="30" rx="7" fill={LAARS} />
      <rect x="210" y="466" width="42" height="30" rx="7" fill={LAARS} />
      {/* armen */}
      <polygon points="148,182 116,292 138,300 166,212" fill={PAK} />
      <polygon points="272,182 304,292 282,300 254,212" fill={PAK} />
      <circle cx="126" cy="298" r="12" fill={HELM} />
      <circle cx="294" cy="298" r="12" fill={HELM} />
      <rect x="115" y="280" width="24" height="6" rx="3" fill={AMBER} transform="rotate(17 127 283)" />
      <rect x="281" y="280" width="24" height="6" rx="3" fill={AMBER} transform="rotate(-17 293 283)" />
      {/* jas */}
      <path d="M160 168 Q210 150 260 168 L280 202 L270 342 Q210 355 150 342 L140 202 Z" fill={PAK} />
      <path d="M144 206 Q210 196 276 206" stroke={HELM} strokeWidth="2" fill="none" />
      {kant === "achter" ? (
        <>
          {/* hoofd van achteren: helm met oranje brillenband */}
          <rect x="188" y="146" width="44" height="26" rx="8" fill={PAK} />
          <ellipse cx="210" cy="126" rx="37" ry="35" fill={HELM} />
          <rect x="172" y="126" width="76" height="12" rx="6" fill={ORANJE} />
          {/* woordmerk onderaan de rug */}
          <text x="210" y="313" textAnchor="middle" fontSize="23" textLength="100" lengthAdjust="spacingAndGlyphs" fill={CREME} style={titan}>
            skimeister
          </text>
          <rect x="160" y="318" width="100" height="3.6" rx="1.8" fill={ORANJE} />
          <rect x="160" y="324" width="100" height="3.6" rx="1.8" fill={AMBER} />
          <rect x="160" y="330" width="100" height="3.6" rx="1.8" fill={CREME} />
        </>
      ) : (
        <>
          {/* gezicht, helm en skibril */}
          <ellipse cx="210" cy="142" rx="26" ry="27" fill={HUID} />
          <path d="M173 132 A37 37 0 0 1 247 132 Z" fill={HELM} />
          <rect x="178" y="122" width="64" height="22" rx="10" fill={AMBER} stroke={INKT} strokeWidth="3" />
          <rect x="186" y="127" width="20" height="5" rx="2.5" fill={CREME} opacity="0.7" />
          <rect x="186" y="156" width="48" height="18" rx="7" fill={PAK} />
          {/* rits en zakken */}
          <line x1="210" y1="172" x2="210" y2="340" stroke={LAARS} strokeWidth="2.5" />
          <line x1="160" y1="282" x2="186" y2="276" stroke={HELM} strokeWidth="2.5" strokeLinecap="round" />
          <line x1="260" y1="282" x2="234" y2="276" stroke={HELM} strokeWidth="2.5" strokeLinecap="round" />
          {/* badge op de linkerborst (rechts in beeld) */}
          <g transform="translate(224 196) scale(0.3)">
            <circle cx="50" cy="50" r="48" fill={INKT} stroke={CREME} strokeWidth="5" />
            <text x="50" y="58" textAnchor="middle" fontSize="54" fill={CREME} style={titan}>
              s
            </text>
            <rect x="27" y="66" width="46" height="7" rx="3.5" fill={ORANJE} />
            <rect x="27" y="77" width="46" height="7" rx="3.5" fill={AMBER} />
          </g>
        </>
      )}
    </g>
  );
}

export function SkileraarInPak({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 560 560"
      className={className}
      role="img"
      aria-label="Skileraar in het zwarte Skimeister-pak: op de rug het woordmerk met drie strepen, op de borst de ronde badge"
    >
      {/* retro zon met strepen */}
      <circle cx="280" cy="250" r="228" fill={AMBER} />
      <rect x="40" y="318" width="480" height="7" fill={INKT} />
      <rect x="40" y="342" width="480" height="11" fill={INKT} />
      <rect x="40" y="370" width="480" height="15" fill={INKT} />
      {/* bergen en sneeuw */}
      <polygon points="0,450 110,318 180,380 280,262 385,392 450,330 560,450 560,560 0,560" fill={CREME} />
      <polygon points="280,262 318,306 298,300 280,318 262,300 244,306" fill="#ebe2d0" />
      <rect x="0" y="470" width="560" height="90" fill={CREME} />
      {/* figuren: achterkant groot, voorkant iets kleiner ernaast */}
      <g transform="translate(-20 0)">
        <Figuur kant="achter" />
      </g>
      <g transform="translate(212 48) scale(0.86)">
        <Figuur kant="voor" />
      </g>
      <text x="190" y="545" textAnchor="middle" fontSize="13" fontWeight="800" letterSpacing="3" fill={INKT}>
        ACHTERKANT
      </text>
      <text x="393" y="545" textAnchor="middle" fontSize="13" fontWeight="800" letterSpacing="3" fill={INKT}>
        VOORKANT
      </text>
    </svg>
  );
}
