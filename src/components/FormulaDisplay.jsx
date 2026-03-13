/**
 * Renders a chemical formula string with proper subscripts and superscripts.
 * - Numbers after element symbols become subscripts (e.g., H2O → H₂O)
 * - Charge notation like 2+, 3-, +, - at the end or after ] become superscripts
 * - Parentheses and brackets are preserved as-is
 */
export default function FormulaDisplay({ formula, className = '' }) {
  if (!formula) return null

  const parts = []
  // Match: charge patterns (e.g. 2+, 3-, +, -), digits, or non-digit sequences
  const regex = /(\d+[+-]|[+-])(?=$|\])|(\d+)|([^0-9]+)/g
  let match
  let i = 0

  while ((match = regex.exec(formula)) !== null) {
    const [full, charge, digits, text] = match
    if (charge !== undefined) {
      parts.push(<sup key={i++}>{charge}</sup>)
    } else if (digits !== undefined) {
      parts.push(<sub key={i++}>{digits}</sub>)
    } else {
      parts.push(<span key={i++}>{text}</span>)
    }
  }

  return <span className={className}>{parts}</span>
}
