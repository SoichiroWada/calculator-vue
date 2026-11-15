<template>
  <main class="calculator-page">
    <h1 class="sr-only">Calculator</h1>
    <section class="calculator" aria-label="Calculator">
      <div class="screen" aria-label="Calculation display with status, input, working expression, and result">
        <div class="screen-status">
          <span v-if="state.hasMemory" class="memory-status">{{ 'MEMORY : ' + memoryDisplay }}</span>
          <span class="message" role="status">{{ state.message }}</span>
        </div>
        <div ref="history" id="output2" class="display-line history" aria-label="Expression history">{{ history }}</div>
        <div ref="working" id="output1" class="display-line working" :aria-label="'Working expression: ' + formattedWorking" tabindex="0">{{ formattedWorking }}</div>
        <output ref="result" id="output5" class="display-line result" :aria-label="'Result: ' + formattedResult" aria-live="polite" aria-atomic="true" tabindex="0">{{ formattedResult }}</output>
      </div>

      <div class="key-deck">
        <div class="utility-panel">
          <div class="memory-keys" aria-label="Memory and editing controls">
            <calculator-key v-for="key in memoryKeys" :key="key.label" :key-info="key" @press="press" />
            <calculator-key class="separator-toggle" :key-info="separatorKey" :aria-pressed="showSeparators" @press="press" />
          </div>
          <fieldset class="mode-control" aria-describedby="mode-help">
            <legend>{{ mode === 'calculator' ? 'CALCULATOR MODE' : 'MATHEMATICS MODE' }}</legend>
            <div class="mode-options">
              <label><input type="radio" name="mode" value="calculator" :checked="mode === 'calculator'" @change="setMode('calculator')"> Calculator</label>
              <label><input type="radio" name="mode" value="mathematics" :checked="mode === 'mathematics'" @change="setMode('mathematics')"> Mathematics</label>
            </div>
            <button id="mode-help" type="button" class="mode-shortcut" aria-keyshortcuts="Alt" title="Press and release Alt to switch calculation mode" @click="toggleMode">Alt to switch</button>
            <span class="sr-only">Calculator evaluates sequentially. Mathematics uses multiplication and division before addition and subtraction.</span>
          </fieldset>
        </div>
        <div class="number-keys" aria-label="Numbers and operators">
          <calculator-key v-for="key in numberKeys" :key="key.label" :key-info="key" @press="press" />
        </div>
      </div>
      <p class="keyboard-hint">Keyboard ready <span aria-hidden="true">·</span> Hover over a key for its shortcut</p>
    </section>
  </main>
</template>

<script>
import CalculatorKey from './CalculatorKey.vue'
import { formatDisplay } from '../calculator/display.mjs'
import { applyAction, createState, formatNumber, inspectExpression } from '../calculator/engine.mjs'
import { createKeyboardController } from '../calculator/keyboard.mjs'

const memoryKeys = [
  { label: 'MC', shortcut: 'Home', description: 'Clear memory', danger: true },
  { label: 'M+', shortcut: 'PageUp', description: 'Add the current result to memory' },
  { label: 'M-', shortcut: 'PageDown', description: 'Subtract the current result from memory' },
  { label: 'MR', shortcut: 'End', description: 'Recall memory' },
  { label: 'BS', shortcut: 'Backspace / Delete', ariaShortcut: 'Backspace Delete', description: 'Delete the last character', danger: true }
]
const numberKeys = ['7', '8', '9', '(', ')', '4', '5', '6', '*', '/', '1', '2', '3', '+', '-', 'AC', '0', '00', '.', '='].map(label => {
  const assignments = {
    '(': ['←', 'ArrowLeft', 'Open parenthesis'],
    ')': ['→', 'ArrowRight', 'Close parenthesis'],
    AC: ['Space bar', 'Space', 'Clear the calculation; keep memory'],
    '00': ['Ctrl', 'Control', 'Enter two zeros (press and release Ctrl)'],
    '=': ['Enter', 'Enter', 'Calculate the result']
  }
  const assignment = assignments[label] || [label, label, label === '.' ? 'Decimal point' : 'Enter ' + label]
  return { label, shortcut: assignment[0], ariaShortcut: assignment[1], description: assignment[2], danger: label === 'AC' }
})

export default {
  name: 'CalculatorPage',
  components: { CalculatorKey },
  data() {
    return { state: createState(), memoryKeys, numberKeys, showSeparators: true }
  },
  computed: {
    mode() { return this.$route.name === 'Mathematics' ? 'mathematics' : 'calculator' },
    inspection() { return inspectExpression(this.state.expression, this.mode) },
    history() { return this.state.expression + (this.state.completed ? '=' : '') },
    working() { return this.state.completed ? this.state.answer : this.inspection.working },
    result() { return this.state.completed ? this.state.answer : this.inspection.result || (this.state.expression ? '' : '0') },
    formattedWorking() { return formatDisplay(this.working, this.showSeparators) },
    formattedResult() { return formatDisplay(this.result, this.showSeparators) },
    memoryDisplay() { return formatDisplay(formatNumber(this.state.memory), this.showSeparators) },
    separatorKey() {
      return { label: 'SEP', shortcut: 'S', tooltipAlign: 'right', description: 'Toggle thousands separators (currently ' + (this.showSeparators ? 'on' : 'off') + ')' }
    }
  },
  watch: {
    mode() {
      this.state.completed = false
      this.state.message = this.mode === 'calculator' ? 'Sequential calculation.' : 'Mathematical operator precedence.'
    }
  },
  mounted() {
    this.keyboard = createKeyboardController(this.press, this.toggleMode)
    window.addEventListener('keydown', this.keyboard.keydown)
    window.addEventListener('keyup', this.keyboard.keyup)
    window.addEventListener('blur', this.keyboard.blur)
  },
  updated() {
    // Long expressions stay readable and keep the most recent input in view.
    const displays = ['history', 'working', 'result']
    displays.forEach(name => {
      const element = this.$refs[name]
      if (element) element.scrollLeft = element.scrollWidth
    })
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.keyboard.keydown)
    window.removeEventListener('keyup', this.keyboard.keyup)
    window.removeEventListener('blur', this.keyboard.blur)
  },
  methods: {
    press(action) {
      if (action === 'SEP') this.showSeparators = !this.showSeparators
      else applyAction(this.state, action, this.mode)
    },
    setMode(mode) {
      if (mode !== this.mode) this.$router.push({ name: mode === 'calculator' ? 'Calculator' : 'Mathematics' })
    },
    toggleMode() { this.setMode(this.mode === 'calculator' ? 'mathematics' : 'calculator') }
  }
}
</script>

<style scoped>
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }
.calculator-page { min-height: 100vh; min-height: 100svh; display: flex; align-items: center; justify-content: center; padding: 36px 24px; }
.calculator { width: min(100%, 1030px); }
.screen { background: #101010; color: #72d6c7; padding: 22px 30px 10px; margin-bottom: 36px; }
.screen-status { min-height: 30px; display: flex; flex-direction: column; text-align: center; overflow-wrap: anywhere; }
.display-line { display: block; overflow-x: auto; scrollbar-width: thin; scrollbar-color: #3e6862 #101010; text-align: right; white-space: nowrap; font-variant-numeric: tabular-nums; line-height: 1.5; }
.screen-status, .history { font-size: 22px; line-height: 1.5; }
.history { min-height: 36px; }
.working, .result { font-size: 48px; line-height: 1.5; min-height: 1.5em; }
.working:focus-visible, .result:focus-visible { outline: 1px solid #73e3d4; outline-offset: 2px; }
.result { margin-top: 4px; }
.key-deck { background: #868282; display: grid; grid-template-columns: 1fr 1.1fr; gap: 64px; padding: 32px 34px 28px 38px; }
.utility-panel { display: flex; flex-direction: column; justify-content: space-between; gap: 28px; min-width: 0; }
.memory-keys, .number-keys { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 12px; }
.memory-keys { gap: 10px; }
.separator-toggle { grid-column: 5; grid-row: 2; }
.separator-toggle[aria-pressed="true"] { box-shadow: inset 0 -3px #72d6c7; }
.number-keys { grid-template-rows: repeat(4, minmax(0, 1fr)); }
.mode-control { align-self: flex-start; margin: 0 0 6px 6px; padding: 18px 22px 10px; background: #000; border: 0; color: #fff; font-size: 14px; text-align: center; }
.mode-control legend { float: left; width: 100%; margin-bottom: 8px; padding: 0; }
.mode-options { clear: both; display: flex; justify-content: center; gap: 9px; }
.mode-options label { display: inline-flex; align-items: center; gap: 3px; cursor: pointer; white-space: nowrap; }
.mode-options input { margin: 0; accent-color: #43c6fa; }
.mode-shortcut { display: block; margin: 8px auto 0; padding: 2px 4px; border: 0; background: none; color: #b6c5c3; font-size: 11px; cursor: pointer; }
.keyboard-hint { color: #aaa; font-size: 12px; text-align: center; margin: 15px 0 0; }
.keyboard-hint span { padding: 0 8px; }
@media (max-width: 800px) {
  .calculator-page { padding: 18px 20px; }
  .screen { padding: 10px 18px 8px; margin-bottom: 20px; }
  .screen-status { min-height: 22px; }
  .screen-status, .history { font-size: 18px; }
  .history { min-height: 27px; }
  .working, .result { font-size: 36px; }
  .key-deck { padding: 20px; gap: 28px; }
  .memory-keys, .number-keys { gap: 8px; }
  .mode-control { margin: 0; padding: 12px 10px 6px; font-size: 12px; }
  .mode-options { gap: 6px; }
}
@media (orientation: landscape) and (max-height: 600px) {
  .calculator-page { padding: 6px 18px; }
  .calculator { max-width: 900px; }
  .screen { padding: 2px 18px; margin-bottom: 10px; }
  .screen-status { min-height: 14px; }
  .screen-status, .history { font-size: 14px; }
  .history { min-height: 20px; }
  .working, .result { font-size: 25px; }
  .result { margin-top: 0; }
  .key-deck { padding: 10px 20px; gap: 34px; }
  .memory-keys, .number-keys { gap: 5px; }
  .number-keys { grid-template-rows: repeat(4, 44px); }
  .utility-panel { gap: 14px; }
  .mode-control { padding: 10px 10px 5px; font-size: 12px; margin: 0; }
  .mode-control legend { margin-bottom: 5px; }
  .mode-shortcut { margin-top: 4px; }
  .keyboard-hint { margin: 7px 0 0; font-size: 10px; }
}
@media (orientation: landscape) and (max-height: 340px) {
  .screen { margin-bottom: 8px; }
  .screen-status { min-height: 12px; }
  .screen-status, .history { font-size: 12px; }
  .history { min-height: 18px; }
  .working, .result { font-size: 23px; }
  .keyboard-hint { display: none; }
}
@media (max-width: 540px) and (orientation: portrait) {
  .calculator-page { padding: 20px 14px; }
  .key-deck { grid-template-columns: 1fr; gap: 22px; padding: 20px; }
  .utility-panel { gap: 18px; }
  .mode-control { align-self: stretch; order: -1; }
  .number-keys { grid-auto-rows: 58px; }
}
</style>
