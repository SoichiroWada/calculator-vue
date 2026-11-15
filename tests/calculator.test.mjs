import { test } from 'node:test'
import assert from 'node:assert/strict'
import { applyAction, createState, inspectExpression } from '../src/calculator/engine.mjs'
import { createKeyboardController } from '../src/calculator/keyboard.mjs'
import { formatDisplay } from '../src/calculator/display.mjs'

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

function enter(actions, mode = 'calculator', state = createState()) {
  for (const action of actions) applyAction(state, action, mode)
  return state
}

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
  assert.equal(state.memory, 7)
  enter(['AC', 'MR', '+', '2', '='], 'calculator', state)
  assert.equal(state.answer, '9')
  enter(['MC', 'AC', '5', 'M-', 'AC', '2', '*', 'MR', '='], 'calculator', state)
  assert.equal(state.answer, '-10')
  enter(['MC', 'MR'], 'calculator', state)
  assert.equal(state.hasMemory, false)
  assert.equal(state.message, 'Memory is empty.')
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
