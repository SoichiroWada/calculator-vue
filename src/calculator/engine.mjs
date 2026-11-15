// A small arithmetic parser: expressions never execute JavaScript.
import Decimal from 'decimal.js'

const OPERATORS = ['+', '-', '*', '/']
const MAX_LENGTH = 512
// An answer can contain 512 significant digits, a sign, point, and exponent.
const MAX_EXPRESSION_LENGTH = MAX_LENGTH * 2 + 16
// Keep input digits through arithmetic instead of converting them to binary floats.
// Recurring quotients round at 512 significant digits; retain the existing range.
const CalculatorDecimal = Decimal.clone({ precision: MAX_LENGTH, maxE: 308, minE: -324 })
const MAX_VALUE = new CalculatorDecimal('1.7976931348623157e308')

function inRange(value) {
  return value.isFinite() && value.abs().lte(MAX_VALUE)
}

function formatNumber(value) {
  const decimal = new CalculatorDecimal(value)
  if (!inRange(decimal)) throw new Error('Result is outside the supported range.')
  return decimal.toString()
}

function calculate(operator, left, right) {
  if (operator === '/' && right.isZero()) throw new Error('Cannot divide by zero.')
  const result = operator === '+' ? left.plus(right)
    : operator === '-' ? left.minus(right)
      : operator === '*' ? left.times(right) : left.dividedBy(right)
  if (!inRange(result)) throw new Error('Result is outside the supported range.')
  return result
}

function parse(expression, mode) {
  if (!expression || expression.length > MAX_EXPRESSION_LENGTH) throw new Error('Enter a complete expression.')
  const tokens = expression.match(/(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?|[()+*/-]/g) || []
  if (tokens.join('') !== expression) throw new Error('Only numbers and arithmetic operators are supported.')
  let position = 0

  function primary() {
    const token = tokens[position++]
    if (token === '+' || token === '-') {
      const operand = primary()
      return { type: 'unary', operator: token, operand, value: token === '-' ? operand.value.negated() : operand.value }
    }
    if (token === '(') {
      // Parentheses retain normal mathematical precedence in both modes.
      const content = binary(0, true)
      if (tokens[position++] !== ')') throw new Error('Close all parentheses before calculating.')
      return { type: 'group', value: content.value }
    }
    if (!token || !/^(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/.test(token)) {
      throw new Error('Enter a complete expression.')
    }
    const value = new CalculatorDecimal(token)
    if (!inRange(value)) throw new Error('Number is outside the supported range.')
    return { type: 'number', text: token, value }
  }

  function binary(minimum, grouped) {
    let left = primary()
    while (OPERATORS.includes(tokens[position])) {
      const operator = tokens[position]
      const precedence = (grouped || mode === 'mathematics') && '*/'.includes(operator) ? 2 : 1
      if (precedence < minimum) break
      position++
      const right = binary(precedence + 1, grouped)
      left = { type: 'binary', operator, left, right, value: calculate(operator, left.value, right.value) }
    }
    return left
  }

  const tree = binary(0, false)
  if (position !== tokens.length) throw new Error('Check the operators and parentheses.')
  return tree
}

function renderWorking(tree, mode) {
  if (tree.type === 'number') return tree.text
  if (tree.type === 'group') return formatNumber(tree.value)
  if (tree.type === 'unary') return tree.operator + renderWorking(tree.operand, mode)
  const left = mode === 'calculator' ? formatNumber(tree.left.value) : renderWorking(tree.left, mode)
  const right = renderWorking(tree.right, mode)
  return left + tree.operator + (tree.right.value.lt(0) ? '(' + right + ')' : right)
}

function inspectExpression(expression, mode = 'calculator') {
  try {
    const tree = parse(expression, mode)
    return { result: formatNumber(tree.value), working: renderWorking(tree, mode), error: '' }
  } catch (error) {
    let working = expression || '0'
    if (expression && OPERATORS.includes(expression.slice(-1))) {
      try {
        working = renderWorking(parse(expression.slice(0, -1), mode), mode) + expression.slice(-1)
      } catch { /* An open parenthesis or unary sign is still being entered. */ }
    }
    return { result: '', working, error: error.message }
  }
}

function createState() {
  return { expression: '', expressionLimit: MAX_LENGTH, completed: false, answer: '0', memory: '0', message: '' }
}

function resetExpression(state) {
  state.expression = ''
  state.expressionLimit = MAX_LENGTH
  state.completed = false
  state.answer = '0'
}

function applyAction(state, action, mode = 'calculator') {
  state.message = ''
  if (action === 'AC') {
    resetExpression(state)
    return
  }
  if (action === 'MC') {
    state.memory = '0'
    state.message = 'Memory cleared.'
    return
  }
  if (action === 'BS') {
    state.completed = false
    state.expression = state.expression.slice(0, -1)
    return
  }
  if (action === '=' || action === 'M+' || action === 'M-') {
    if (!state.expression && action === '=') return
    const inspection = state.completed ? { result: state.answer, error: '' }
      : state.expression ? inspectExpression(state.expression, mode) : { result: '0', error: '' }
    if (inspection.error) {
      state.message = inspection.error
      return
    }
    if (action !== '=') {
      try {
        state.memory = formatNumber(calculate(action === 'M+' ? '+' : '-',
          new CalculatorDecimal(state.memory), new CalculatorDecimal(inspection.result)))
        state.message = action === 'M+' ? 'Added to memory.' : 'Subtracted from memory.'
      } catch (error) {
        state.message = error.message
        return
      }
    }
    state.answer = inspection.result
    state.completed = true
    if (!state.expression) state.expression = '0'
    return
  }
  if (state.completed) {
    if (OPERATORS.includes(action)) {
      state.expression = state.answer
      // Give continued input its own budget, even after a long quotient.
      state.expressionLimit = state.answer.length + MAX_LENGTH
      state.completed = false
    } else if (/^(?:\d|00|\.|\(|MR)$/.test(action)) {
      resetExpression(state)
    }
  }

  const expression = state.expression
  const last = expression.slice(-1)
  const needsOperand = !expression || OPERATORS.includes(last) || last === '('
  let next = expression

  if (action === 'MR') {
    const value = formatNumber(state.memory)
    next += (needsOperand ? '' : '*') + (value.startsWith('-') ? '(' + value + ')' : value)
    // Recalling a generated result must also work when it exceeds the key limit.
    if (next.length > state.expressionLimit) state.expressionLimit = next.length + MAX_LENGTH
    state.message = 'Memory recalled.'
  } else if (/^(?:\d|00)$/.test(action)) {
    if (last === ')') next += '*'
    const current = next.match(/(?:^|[()+*/-])(\d*\.?\d*)$/)
    if (current && current[1] === '0') next = next.slice(0, -1)
    next += action === '00' && needsOperand ? '0' : action
    if (/^0+$/.test(next)) next = '0'
  } else if (action === '.') {
    if (last === ')') next += '*'
    const current = next.match(/(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/)
    if (current && (current[0].includes('.') || current[0].includes('e'))) return
    next += current ? '.' : '0.'
  } else if (OPERATORS.includes(action)) {
    if (needsOperand) {
      if (OPERATORS.includes(last)) {
        if (action === '-' && (last === '*' || last === '/')) next += '-'
        else if (expression.length > 1 && !'(+*/-'.includes(expression.slice(-2, -1))) next = expression.slice(0, -1) + action
        else if (last === '-' && expression.length > 1 && OPERATORS.includes(expression.slice(-2, -1))) next = expression.slice(0, -2) + action
        else return
      } else if (action === '-') next += '-'
      else return
    } else next += action
  } else if (action === '(') {
    next += (needsOperand ? '' : '*') + '('
  } else if (action === ')') {
    const balance = (expression.match(/\(/g) || []).length - (expression.match(/\)/g) || []).length
    if (balance <= 0 || needsOperand) {
      state.message = 'Enter a number inside an open parenthesis first.'
      return
    }
    next += ')'
  } else return

  const limit = Math.min(state.expressionLimit, MAX_EXPRESSION_LENGTH)
  if (next.length > limit) state.message = 'Expression limit reached (' + limit + ' characters).'
  else state.expression = next
}

export { applyAction, createState, formatNumber, inspectExpression }
