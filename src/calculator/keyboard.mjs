const KEY_ACTIONS = {
  ArrowLeft: '(', ArrowRight: ')', Enter: '=', '=': '=',
  ' ': 'AC', Spacebar: 'AC', Backspace: 'BS', Delete: 'BS',
  End: 'MR', PageDown: 'M-', PageUp: 'M+', Home: 'MC',
  s: 'SEP', S: 'SEP'
}

// Ctrl and Alt act on release so shortcuts such as Ctrl+C do not enter 00.
function createKeyboardController(onAction, onToggle) {
  const pending = { Control: false, Alt: false }
  function isEditable(target) {
    return target && (target.isContentEditable || /^(TEXTAREA|SELECT)$/.test(target.tagName) ||
      (target.tagName === 'INPUT' && !['radio', 'checkbox', 'button'].includes(target.type)))
  }
  return {
    keydown(event) {
      if (event.isComposing || event.keyCode === 229 || isEditable(event.target)) return
      Object.keys(pending).forEach(key => {
        if (event.key !== key) pending[key] = false
      })
      if (event.key === 'Control' || event.key === 'Alt') {
        if (!event.repeat) pending[event.key] = !(event.metaKey ||
          (event.key === 'Alt' && event.ctrlKey) || (event.key === 'Control' && event.altKey))
        if (event.key === 'Alt') event.preventDefault()
        return
      }
      if (event.ctrlKey || event.metaKey || event.altKey) return
      const action = KEY_ACTIONS[event.key] ||
        (/^[0-9.+*/()-]$/.test(event.key) ? event.key :
          event.code === 'NumpadDecimal' ? '.' : null)
      if (action) {
        event.preventDefault()
        if (!event.repeat || action === 'BS') onAction(action)
      }
    },
    keyup(event) {
      if (event.key !== 'Control' && event.key !== 'Alt') return
      const active = pending[event.key]
      pending[event.key] = false
      if (event.key === 'Alt') event.preventDefault()
      if (!active || event.isComposing || isEditable(event.target)) return
      if (event.key === 'Control') onAction('00')
      else onToggle()
    },
    blur() { pending.Control = false; pending.Alt = false }
  }
}

export { createKeyboardController }
