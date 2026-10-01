/**
 * Parses a listed university fee into a full-programme amount in rupees.
 * Returns null when the listing isn't a comparable total:
 *  - "Contact for fee" (no amount)
 *  - per-semester fees ("₹45,000/Sem") - not comparable with totals
 * Ranges ("₹65,000 to ₹2,50,000/-") use the starting (first) amount.
 */
export function parseTotalFee(fee: string | null | undefined): number | null {
  if (!fee || /\/\s*sem|per\s*sem|semester/i.test(fee)) return null;
  const first = fee.match(/\d[\d,]*/)?.[0];
  if (!first) return null;
  const amount = Number(first.replace(/,/g, ""));
  return amount > 0 ? amount : null;
}
