<template>
  <button
    type="button"
    class="calculator-key"
    :class="{ danger: keyInfo.danger }"
    :data-key="keyInfo.label"
    :aria-label="keyInfo.label + ': ' + keyInfo.description"
    :aria-keyshortcuts="keyInfo.ariaShortcut || keyInfo.shortcut"
    :aria-describedby="tooltipId"
    @click="$emit('press', keyInfo.label)"
  >
    {{ keyInfo.label }}
    <span :id="tooltipId" class="key-tooltip" role="tooltip">
      <strong>{{ keyInfo.description }}</strong>
      Keyboard: {{ keyInfo.shortcut }}
    </span>
  </button>
</template>

<script>
export default {
  name: 'CalculatorKey',
  props: { keyInfo: { type: Object, required: true } },
  computed: {
    tooltipId() { return 'key-tip-' + this.keyInfo.label.split('').map(char => char.charCodeAt(0)).join('-') }
  }
}
</script>

<style scoped>
.calculator-key { position: relative; min-width: 0; min-height: 64px; aspect-ratio: 1; padding: 10px 2px; border: 3px outset #c9cecd; border-radius: 0; background: #003a6d; color: #fff; font-size: clamp(20px, 2.4vw, 30px); font-weight: 400; line-height: 1.4; cursor: pointer; -webkit-tap-highlight-color: transparent; }
.calculator-key.danger { background: #d9534f; }
.calculator-key:hover { background: #084b80; }
.calculator-key.danger:hover { background: #e4635e; }
.calculator-key:active { border-style: inset; }
.calculator-key:hover, .calculator-key:focus-visible { z-index: 2; }
.key-tooltip { position: absolute; z-index: 3; bottom: calc(100% + 10px); left: 50%; width: max-content; max-width: 210px; padding: 9px 12px; transform: translateX(-50%); background: #171b1d; color: #fff; border: 1px solid #a3b9b6; border-radius: 5px; box-shadow: 0 4px 14px #0006; font-size: 12px; line-height: 1.5; font-weight: 400; white-space: normal; pointer-events: none; visibility: hidden; opacity: 0; }
.key-tooltip strong { display: block; font-weight: 500; color: #8ce0d3; }
.calculator-key:hover .key-tooltip, .calculator-key:focus-visible .key-tooltip { visibility: visible; opacity: 1; }
.calculator-key:nth-child(5n) .key-tooltip { left: auto; right: 0; transform: none; }
.calculator-key:nth-child(5n + 1) .key-tooltip { left: 0; transform: none; }
@media (max-width: 800px) {
  .calculator-key { min-height: 48px; font-size: 22px; border-width: 2px; padding: 7px 1px; }
}
@media (orientation: landscape) and (max-height: 600px) {
  .calculator-key { min-height: 44px; aspect-ratio: auto; font-size: 22px; padding: 2px 1px; border-width: 2px; }
  .key-tooltip { font-size: 11px; max-width: 170px; }
}
</style>
