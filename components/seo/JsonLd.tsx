/**
 * Structured data als script-tag. Eén of meer schema.org-objecten; bij meer
 * objecten krijgt elk een eigen tag, zodat een fout in het ene het andere niet
 * meeneemt.
 */
export function JsonLd({ data }: { data: object | object[] }) {
  const lijst = Array.isArray(data) ? data : [data];
  return (
    <>
      {lijst.map((d, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(d).replace(/</g, "\u003c") }}
        />
      ))}
    </>
  );
}
