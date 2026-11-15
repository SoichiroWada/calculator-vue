import { test } from 'node:test'
import assert from 'node:assert/strict'
import { applyAction, createState, inspectExpression } from '../src/calculator/engine.mjs'
import { createKeyboardController } from '../src/calculator/keyboard.mjs'
import { formatDisplay, formatHistory, formatDigits } from '../src/calculator/display.mjs'

test('display groups integer parts of expression tokens with apostrophes', () => {
  assert.equal(formatDisplay('123456789'), "123'456'789")
  assert.equal(formatDisplay('-1234567.890123+(.75*10000)-9876.'), "-1'234'567.890123+(.75*10'000)-9'876.")
  assert.equal(formatDisplay('123+456='), '123+456=')
  assert.equal(formatDisplay(''), '')
})

test('display preserves scientific notation and does not group fractional or exponent digits', () => {
  assert.equal(formatDisplay('1.23456789e+100'), '1.23456789e+100')
  assert.equal(formatDisplay('12345e-100+12345E+100'), "12'345e-100+12'345E+100")
  assert.equal(formatDisplay('0.000000123456'), '0.000000123456')
})

test('separator preference switches formatting without changing the original expression', () => {
  const expression = '-1234567.890123+10000e-12'
  assert.equal(formatDisplay(expression, false), expression)
  assert.equal(formatDisplay(expression, true), "-1'234'567.890123+10'000e-12")
  assert.equal(formatDisplay(expression, false), expression)
})

test('display digits default to full precision and preserve exact values', () => {
  assert.equal(formatDigits('1234567890123456790'), "1'234'567'890'123'456'790")
  assert.equal(formatDigits('0.' + '3'.repeat(512)), '0.' + '3'.repeat(512))
  for (const digits of [10, 16, 20, 30]) {
    assert.equal(formatDigits('', digits), '')
    assert.equal(formatDigits('0', digits), '0')
    assert.equal(formatDigits('728', digits), '728')
    assert.equal(formatDigits('0.125', digits), '0.125')
    assert.equal(formatDigits('1e+100', digits), '1 × 10¹⁰⁰')
  }
  assert.equal(formatDigits('1234567890123456790', 20), "1'234'567'890'123'456'790")
})

test('display digits round significant digits rather than decimal places', () => {
  const value = '1.2345678901234567890123456789012345'
  for (const [digits, expected] of [
    [10, '1.234567890'], [16, '1.234567890123457'],
    [20, '1.2345678901234567890'], [30, '1.23456789012345678901234567890']
  ]) assert.equal(formatDigits(value, digits), expected)
  assert.equal(formatDigits('1234567890123456790', 10), '1.234567890 × 10¹⁸')
  assert.equal(formatDigits('1.234567890123456789e-100', 10), '1.234567890 × 10⁻¹⁰⁰')
  assert.equal(formatDigits('0.000012345678901', 10), '0.00001234567890')
})

test('display digits handle rounding ties, negative values, and carry into a new exponent', () => {
  assert.equal(formatDigits('1.2345678905', 10), '1.234567891')
  assert.equal(formatDigits('-1.2345678905', 10), '-1.234567891')
  assert.equal(formatDigits('9999999999.5', 10), '1.000000000 × 10¹⁰')
  assert.equal(formatDigits('-9999999999.5', 10), '-1.000000000 × 10¹⁰')
  assert.equal(formatDigits('12345678.123456789', 16), "12'345'678.12345679")
  assert.equal(formatDigits('12345678.123456789', 16, false), '12345678.12345679')
  assert.equal(formatDigits('1234567890123456790', 'full', false), '1234567890123456790')
})

test('display digits format working operands and subtotals without hiding operators or groups', () => {
  assert.equal(formatDigits('1234567890123456789+0.123456789012345', 10),
    '(1.234567890 × 10¹⁸)+0.1234567890')
  assert.equal(formatDigits('1/1234567890123456789', 10), '1/(1.234567890 × 10¹⁸)')
  assert.equal(formatDigits('-1234567890123456789/1e-100', 10),
    '-(1.234567890 × 10¹⁸)/(1 × 10⁻¹⁰⁰)')
  assert.equal(formatDigits('1234567890123456789+', 10), '(1.234567890 × 10¹⁸)+')
  assert.equal(formatDigits('(0.123456789012345+2)*-3', 10), '(0.1234567890+2)*-3')
  assert.equal(formatDigits('12345678.123456789*(2+3)', 16), "12'345'678.12345679*(2+3)")
  assert.equal(formatDigits('12345678.123456789*(2+3)', 16, false), '12345678.12345679*(2+3)')
  assert.equal(formatDigits('1234567890123456789+0.123456789012345', 'full'),
    "1'234'567'890'123'456'789+0.123456789012345")
})

function enter(actions, mode = 'calculator', state = createState()) {
  for (const action of actions) applyAction(state, action, mode)
  return state
}

test('Calculator history adds parentheses as precedence changes during input', () => {
  const state = createState()
  for (const [action, expected] of [
    ['2', '2'], ['+', '2+'], ['3', '2+3'], ['*', '(2+3)*'], ['5', '(2+3)*5'],
    ['-', '(2+3)*5-'], ['1', '(2+3)*5-1'], ['5', '(2+3)*5-15'],
    ['/', '((2+3)*5-15)/'], ['2', '((2+3)*5-15)/2']
  ]) {
    applyAction(state, action)
    assert.equal(formatHistory(state.expression), expected)
  }
  assert.equal(state.expression, '2+3*5-15/2')
  applyAction(state, '=')
  assert.equal(state.answer, '5')
  assert.equal(formatHistory(state.expression), '((2+3)*5-15)/2')
  assert.equal(formatHistory('2+3-6+7'), '2+3-6+7')
  assert.equal(formatHistory('2*3/4*5'), '2*3/4*5')
})

test('history preserves explicit groups, unary signs, decimals, exponents, and incomplete input', () => {
  for (const [expression, expected] of [
    ['(12+89-88)*56', '(12+89-88)*56'],
    ['2+(3+4*5)/2', '(2+(3+4*5))/2'],
    ['-2+3*-4', '(-2+3)*-4'],
    ['2+3*-(4+5)', '(2+3)*-(4+5)'],
    ['0.1+0.2*10', '(0.1+0.2)*10'],
    ['1e-7+2e-7/3', '(1e-7+2e-7)/3'],
    ['2+3*(4+5', '(2+3)*(4+5'],
    ['2+3*-', '(2+3)*-'],
    ['1/0+2*3', '(1/0+2)*3'],
    ['', '']
  ]) {
    assert.equal(formatHistory(expression), expected)
    assert.equal(formatHistory(expression, 'mathematics'), expression)
  }
})

test('displayed Calculator history represents the sequential result using mathematical precedence', () => {
  for (const expression of ['2+3*5', '2+3*5-15/2', '2+3-6+7', '8/2+1*3', '2+(3+4*5)/2', '-2+3*-4', '1e-7+2e-7/3']) {
    assert.equal(inspectExpression(formatHistory(expression), 'mathematics').result, inspectExpression(expression).result)
  }
})

test('automatic history parentheses follow editing and operator replacement without changing input', () => {
  const state = enter('2+3*5')
  enter(['BS', 'BS'], 'calculator', state)
  assert.equal(formatHistory(state.expression), '2+3')
  enter(['*', '-', '4'], 'calculator', state)
  assert.equal(formatHistory(state.expression), '(2+3)*-4')
  assert.equal(formatHistory(state.expression, 'mathematics'), '2+3*-4')
  enter(['BS', 'BS', '+', '4'], 'calculator', state)
  assert.equal(state.expression, '2+3+4')
  assert.equal(formatHistory(state.expression), '2+3+4')
  assert.equal(formatHistory('123456+1000*2'), '(123456+1000)*2')
})

test('reference calculation retains three distinct display roles', () => {
  const state = enter('(12+89-88)*56')
  assert.equal(state.expression, '(12+89-88)*56')
  assert.deepEqual(inspectExpression(state.expression), { result: '728', working: '13*56', error: '' })
  applyAction(state, '=')
  assert.equal(state.answer, '728')
  assert.equal(state.completed, true)
})

test('sequential mode and mathematics precedence remain distinct', () => {
  assert.equal(enter('2+3*4=').answer, '20')
  assert.equal(enter('2+3*4=', 'mathematics').answer, '14')
  assert.equal(inspectExpression('2+3*4').working, '5*4')
  assert.equal(inspectExpression('2+3*4', 'mathematics').working, '2+3*4')
  assert.equal(enter('(2+3*4)*2=').answer, '28')
  assert.equal(enter('((2+3)*4)-6/2=', 'mathematics').answer, '17')
})

test('editing handles decimal points, zeros, operator replacement and negative operands', () => {
  assert.equal(enter(['0', '0', '5', '00', '.', '.', '2', '=']).answer, '500.2')
  assert.equal(enter(['.', '5', '+', '.', '2', '=']).answer, '0.7')
  assert.equal(enter(['2', '+', '*', '3', '=']).answer, '6')
  assert.equal(enter(['2', '*', '-', '3', '=']).answer, '-6')
  assert.equal(enter('-2*(-3)=').answer, '6')
  assert.equal(enter(['2', '+', '3', 'BS', '4', '=']).answer, '6')
  assert.equal(enter(['2', '+', 'BS', '3', '=']).answer, '23')
})

test('completed results can be continued or replaced, and backspace edits history', () => {
  assert.equal(enter('2+3=*4=').answer, '20')
  assert.equal(enter('2+3=7=').answer, '7')
  assert.equal(enter(['2', '+', '3', '=', 'BS', '4', '=']).answer, '6')
  assert.equal(enter(['2', '+', '3', '=', '00']).expression, '0')
})

test('memory accumulates, subtracts, survives AC, recalls negative values, and clears separately', () => {
  const state = enter(['5', 'M+', 'M+', 'AC', '3', 'M-'])
  assert.equal(state.memory, '7')
  enter(['AC', 'MR', '+', '2', '='], 'calculator', state)
  assert.equal(state.answer, '9')
  enter(['MC', 'AC', '5', 'M-', 'AC', '2', '*', 'MR', '='], 'calculator', state)
  assert.equal(state.answer, '-10')
  enter(['MC', 'MR'], 'calculator', state)
  assert.equal(state.memory, '0')
  assert.equal(state.expression, '0')
  assert.equal(state.message, 'Memory recalled.')
})

test('M+ and M- finish pending calculations and keep their results visible in both modes', () => {
  for (const [mode, answer] of [['calculator', '20'], ['mathematics', '14']]) {
    for (const [action, sign] of [['M+', 1], ['M-', -1]]) {
      const state = enter('2+3*4', mode)
      applyAction(state, action, mode)
      assert.equal(state.memory, String(sign * Number(answer)))
      assert.equal(state.answer, answer)
      assert.equal(state.completed, true)
      assert.equal(state.expression, '2+3*4')
      applyAction(state, action, mode)
      assert.equal(state.memory, String(sign * 2 * Number(answer)))
      applyAction(state, '7', mode)
      assert.equal(state.expression, '7')
      assert.equal(state.completed, false)
      assert.equal(state.memory, String(sign * 2 * Number(answer)))
    }
  }
})

test('fresh digits, decimal points and double-zero replace results after memory operations', () => {
  for (const memoryAction of ['M+', 'M-']) {
    for (const [action, expected] of [['3', '3'], ['.', '0.'], ['00', '0'], ['(', '(']]) {
      const state = enter(['5', '*', '4', memoryAction, action])
      assert.equal(state.expression, expected)
      assert.equal(state.completed, false)
    }
    const continued = enter(['5', '*', '4', memoryAction, '+', '2', '='])
    assert.equal(continued.answer, '22')
  }
})

test('memory starts at zero, cancels to zero, and recalls zero as a number', () => {
  const state = createState()
  assert.equal(state.memory, '0')
  applyAction(state, 'MR')
  assert.equal(state.expression, '0')
  enter(['AC', '5', 'M+', 'M-'], 'calculator', state)
  assert.equal(state.memory, '0')
  assert.equal(state.answer, '5')
  assert.equal(state.completed, true)
  enter(['MR', '+', '2', '='], 'calculator', state)
  assert.equal(state.answer, '2')
  for (const action of ['M+', 'M-']) {
    const empty = createState()
    applyAction(empty, action)
    assert.equal(empty.memory, '0')
    assert.equal(empty.answer, '0')
    assert.equal(empty.expression, '0')
    assert.equal(empty.completed, true)
  }
})

test('memory handles decimals, negative values and completed answers without formatted display text', () => {
  const state = enter(['0', '.', '1', 'M+', '0', '.', '2', 'M+'])
  assert.equal(state.memory, '0.3')
  enter(['0', '.', '3', 'M-'], 'calculator', state)
  assert.equal(state.memory, '0')
  enter(['1', '2', '3', '4', '5', '6', '7', '.', '5', '=', 'M-'], 'calculator', state)
  assert.equal(state.memory, '-1234567.5')
  assert.equal(state.answer, '1234567.5')
  assert.equal(state.completed, true)
  applyAction(state, 'MC')
  assert.equal(state.memory, '0')
  assert.equal(state.answer, '1234567.5')
  assert.equal(state.completed, true)
})

test('invalid expressions and memory overflow preserve memory and leave failed calculations editable', () => {
  for (const action of ['M+', 'M-']) {
    for (const expression of ['5*', '1/0', '(2+3']) {
      const state = enter(['7', 'M+', 'AC', ...expression])
      applyAction(state, action)
      assert.equal(state.memory, '7')
      assert.equal(state.expression, expression)
      assert.equal(state.completed, false)
      assert.ok(state.message)
    }
    const state = createState()
    state.memory = action === 'M+' ? '1e+308' : '-1e+308'
    state.expression = '1e308'
    applyAction(state, action)
    assert.equal(state.memory, action === 'M+' ? '1e+308' : '-1e+308')
    assert.equal(state.expression, '1e308')
    assert.equal(state.completed, false)
    assert.equal(state.message, 'Result is outside the supported range.')
  }
})

test('invalid and incomplete expressions report errors without losing editable input', () => {
  for (const expression of ['1/0', '1+', '(', '(1+2', '1+()', 'alert(1)', '1**2', '1e999']) {
    assert.ok(inspectExpression(expression).error, expression)
  }
  const state = enter('1/0=')
  assert.equal(state.message, 'Cannot divide by zero.')
  assert.equal(state.completed, false)
  enter(['BS', '2', '='], 'calculator', state)
  assert.equal(state.answer, '0.5')
  assert.equal(enter([')', '2', '=']).answer, '2')
  const long = enter('1'.repeat(520))
  assert.equal(long.expression.length, 512)
})

test('floating-point artifacts and scientific notation are handled', () => {
  assert.equal(enter('0.1+0.2=').answer, '0.3')
  assert.equal(inspectExpression('1e-7*2').result, '2e-7')
  assert.equal(inspectExpression('1e+20/2').result, '50000000000000000000')
})

test('19-digit input stays exact in the working row and quick view after every key', () => {
  for (const mode of ['calculator', 'mathematics']) {
    const state = createState()
    for (const digit of '1234567890123456789') {
      applyAction(state, digit, mode)
      assert.deepEqual(inspectExpression(state.expression, mode), {
        result: state.expression, working: state.expression, error: ''
      })
    }
    applyAction(state, '+', mode)
    assert.equal(inspectExpression(state.expression, mode).working, '1234567890123456789+')
    applyAction(state, '1', mode)
    assert.deepEqual(inspectExpression(state.expression, mode), {
      result: '1234567890123456790', working: '1234567890123456789+1', error: ''
    })
    applyAction(state, '=', mode)
    assert.equal(state.answer, '1234567890123456790')
    assert.equal(state.completed, true)
    assert.equal(formatDisplay(state.answer), "1'234'567'890'123'456'790")
    assert.equal(formatDisplay(state.answer, false), '1234567890123456790')
    assert.equal(state.expression, '1234567890123456789+1')
  }
})

test('large integers and long decimals retain precision through all four operators', () => {
  for (const mode of ['calculator', 'mathematics']) {
    for (const [expression, answer] of [
      ['9007199254740992+1', '9007199254740993'],
      ['1234567890123456789-1234567890123456788', '1'],
      ['1234567890123456789*9', '11111111011111111101'],
      ['1234567890123456789/3', '411522630041152263'],
      ['1234567890123456789.123456789+0.000000001', '1234567890123456789.12345679'],
      ['0.1234567890123456789*10', '1.234567890123456789'],
      ['1.0000000000000000001-1', '1e-19'],
      ['1/8', '0.125'],
      ['-1234567890123456789+1', '-1234567890123456788'],
      ['2*(-1234567890123456789)', '-2469135780246913578'],
      ['(1234567890123456789+1)/2', '617283945061728395']
    ]) {
      assert.equal(enter(expression + '=', mode).answer, answer, expression)
    }
    assert.equal(enter('1234567890123456789+1=*2=-1=', mode).answer, '2469135780246913579')
  }
  assert.equal(inspectExpression('1234567890123456789+1*2').working, '1234567890123456790*2')
  assert.equal(enter('1234567890123456789+1*2=').answer, '2469135780246913580')
  assert.equal(enter('1234567890123456789+1*2=', 'mathematics').answer, '1234567890123456791')
})

test('memory accumulation, recall, and continued answers preserve large decimal values', () => {
  for (const mode of ['calculator', 'mathematics']) {
    const state = enter([...('1234567890123456789+1'), 'M+', 'M+'], mode)
    assert.equal(state.answer, '1234567890123456790')
    assert.equal(state.memory, '2469135780246913580')
    enter(['AC', 'MR', '-', ...'2469135780246913579', '='], mode, state)
    assert.equal(state.answer, '1')
    applyAction(state, 'M-', mode)
    assert.equal(state.memory, '2469135780246913579')
    enter(['AC', 'MR', 'M-'], mode, state)
    assert.equal(state.memory, '0')
    enter(['AC', ...'0.1234567890123456789', 'M-', 'AC', 'MR', '='], mode, state)
    assert.equal(state.memory, '-0.1234567890123456789')
    assert.equal(state.answer, '-0.1234567890123456789')
    applyAction(state, 'MC', mode)
    assert.equal(state.memory, '0')
  }
})

test('long recurring results can be continued and recalled without exceeding the input budget', () => {
  for (const mode of ['calculator', 'mathematics']) {
    const state = enter('1/3=', mode)
    const quotient = '0.' + '3'.repeat(512)
    assert.equal(state.answer, quotient)
    enter('+1=', mode, state)
    assert.equal(state.answer, '1.' + '3'.repeat(511))
    enter(['M+', 'AC', 'MR', '='], mode, state)
    assert.equal(state.answer, '1.' + '3'.repeat(511))
    assert.equal(state.message, '')
    enter(['AC', 'MR', '+', '1', '='], mode, state)
    assert.equal(state.answer, '2.' + '3'.repeat(511))
    applyAction(state, 'AC', mode)
    enter('1'.repeat(520), mode, state)
    assert.equal(state.expression.length, 512)
    assert.ok(state.message)
  }
})

function keyboardFixture() {
  const actions = []
  let toggles = 0
  const controller = createKeyboardController(action => actions.push(action), () => toggles++)
  function event(key, options = {}) {
    return { key, preventDefault() { this.prevented = true }, ...options }
  }
  return { actions, controller, event, toggles: () => toggles }
}

test('every requested physical key maps to the matching virtual key', () => {
  const { actions, controller, event } = keyboardFixture()
  const assignments = [
    ...'0123456789+-*/.'.split('').map(key => [key, key]),
    ['ArrowLeft', '('], ['ArrowRight', ')'], ['Enter', '='], [' ', 'AC'],
    ['Backspace', 'BS'], ['Delete', 'BS'], ['End', 'MR'],
    ['PageDown', 'M-'], ['PageUp', 'M+'], ['Home', 'MC'], ['s', 'SEP'], ['S', 'SEP']
  ]
  for (const [key, action] of assignments) {
    const input = event(key)
    controller.keydown(input)
    assert.equal(actions.pop(), action)
    assert.equal(input.prevented, true)
  }
  controller.keydown(event('Decimal', { code: 'NumpadDecimal' }))
  assert.equal(actions.pop(), '.')
})

test('standalone modifiers act once on release and browser shortcuts are preserved', () => {
  const fixture = keyboardFixture()
  const { actions, controller, event } = fixture
  controller.keydown(event('Control', { ctrlKey: true }))
  controller.keydown(event('Control', { ctrlKey: true, repeat: true }))
  assert.equal(actions.length, 0)
  controller.keyup(event('Control'))
  assert.deepEqual(actions, ['00'])
  controller.keydown(event('Alt', { altKey: true }))
  controller.keyup(event('Alt'))
  assert.equal(fixture.toggles(), 1)
  for (const key of ['Control', 'Alt']) {
    controller.keydown(event(key))
    const chord = event('c', { ctrlKey: key === 'Control', altKey: key === 'Alt' })
    controller.keydown(chord)
    controller.keyup(event(key))
    assert.equal(chord.prevented, undefined)
  }
  assert.deepEqual(actions, ['00'])
  assert.equal(fixture.toggles(), 1)
  controller.keydown(event('Control'))
  controller.blur()
  controller.keyup(event('Control'))
  assert.deepEqual(actions, ['00'])
})

test('keyboard works after buttons and radios gain focus without double activation', () => {
  const { actions, controller, event } = keyboardFixture()
  controller.keydown(event('Enter', { target: { tagName: 'BUTTON' } }))
  controller.keydown(event(' ', { target: { tagName: 'INPUT', type: 'radio' } }))
  assert.deepEqual(actions, ['=', 'AC'])
  controller.keydown(event('1', { isComposing: true }))
  controller.keydown(event('1', { target: { tagName: 'INPUT', type: 'text' } }))
  controller.keydown(event('1', { repeat: true }))
  controller.keydown(event('Backspace', { repeat: true }))
  assert.deepEqual(actions, ['=', 'AC', 'BS'])
})

test('separator shortcut ignores repeats, modifier shortcuts, composition, and editable inputs', () => {
  const { actions, controller, event } = keyboardFixture()
  controller.keydown(event('s', { repeat: true }))
  for (const options of [{ ctrlKey: true }, { metaKey: true }, { altKey: true }, { isComposing: true }, { target: { tagName: 'INPUT', type: 'text' } }]) {
    const key = event('s', options)
    controller.keydown(key)
    assert.equal(key.prevented, undefined)
  }
  assert.deepEqual(actions, [])
  controller.keydown(event('s', { target: { tagName: 'BUTTON' } }))
  assert.deepEqual(actions, ['SEP'])
})
