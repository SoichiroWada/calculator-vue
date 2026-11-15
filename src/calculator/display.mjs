import Decimal from 'decimal.js'

const DisplayDecimal = Decimal.clone({ rounding: Decimal.ROUND_HALF_UP })
const SUPERSCRIPT_DIGITS = '⁰¹²³⁴⁵⁶⁷⁸⁹'

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

// Formatted numbers and expressions are never passed back to the arithmetic engine.
function formatDigits(value, digits = 'full', showSeparators = true) {
  if (value === '' || digits === 'full') return formatDisplay(value, showSeparators)

  const expression = String(value)
  const isSingleNumber = /^[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/i.test(expression)
  return expression.replace(/(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?/gi, token => {
    const original = new DisplayDecimal(token)
    const rounded = original.toSignificantDigits(digits)
    const text = !rounded.eq(original) ? rounded.toPrecision(digits)
      : original.e >= digits ? original.toExponential() : original.toString()
    let scientific = false
    const formatted = formatDisplay(text, showSeparators).replace(/e([+-]?\d+)$/i, (_, exponent) => {
      scientific = true
      const superscript = exponent.replace('-', '⁻').replace('+', '')
        .replace(/\d/g, digit => SUPERSCRIPT_DIGITS[digit])
      return ' × 10' + superscript
    })
    // Keep a scientific-notation operand intact, particularly after division.
    return scientific && !isSingleNumber ? '(' + formatted + ')' : formatted
  })
}

function formatHistory(expression, mode = 'calculator') {
  if (mode !== 'calculator' || !expression) return expression
  const tokens = expression.match(/(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?|[()+*/-]/gi) || []
  if (tokens.join('') !== expression) return expression

  let history = ''
  let depth = 0
  let needsOperand = true
  let hasAdditionOrSubtraction = false
  for (const token of tokens) {
    if (token === '(') depth++
    else if (token === ')') {
      depth--
      if (depth === 0) needsOperand = false
    } else if (depth === 0) {
      if ('+-*/'.includes(token)) {
        if (!needsOperand) {
          if (token === '+' || token === '-') hasAdditionOrSubtraction = true
          else if (hasAdditionOrSubtraction) {
            // Make sequential evaluation visible before multiplication/division.
            history = '(' + history + ')'
            hasAdditionOrSubtraction = false
          }
        }
        needsOperand = true
      } else needsOperand = false
    }
    // Explicit parentheses already use mathematical precedence in both modes.
    history += token
  }
  return history
}

export { formatDisplay, formatHistory, formatDigits }
