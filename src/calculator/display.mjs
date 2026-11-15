// Format numeric tokens without changing the expression used for calculations.
function formatDisplay(value, showSeparators = true) {
  if (!showSeparators) return String(value)
  return String(value).replace(/(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?/gi, token => {
    const [mantissa, exponent = ''] = token.split(/(?=e)/i)
    const [integer, fraction] = mantissa.split('.')
    const grouped = integer.replace(/\B(?=(\d{3})+(?!\d))/g, "'")
    return grouped + (fraction === undefined ? '' : '.' + fraction) + exponent
  })
}

export { formatDisplay }
