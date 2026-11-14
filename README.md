# Calculator

A Vue calculator designed for desktop and landscape phones, styled after `calculator23.jpg`. Both modes share one calculator and memory register.

## Develop and verify

Use Node.js 18 or later (verified with Node.js 24).

```sh
npm install
npm run serve
npm test
npm run lint -- --no-fix
npm run build
```

The CLI wrapper enables the legacy OpenSSL provider needed by this project's Vue CLI 3 / webpack 4 toolchain on modern Node.js. No dependency upgrade is required for these changes.

Production files are generated in `dist`. If an existing `dist` belongs to another user, build into a writable location instead:

```sh
npm run build -- --dest /tmp/calculator-build
```

## Display and calculation modes

The three horizontal display rows show:

1. **Expression history** — the full input, with `=` added when finalized.
2. **Working expression** — completed parentheses and sequential subtotals are reduced as you type.
3. **Live result** — the result of a complete expression; Enter finalizes it.

For example, `(12+89-88)*56` displays `(12+89-88)*56`, `13*56`, and `728`.

**Calculator mode** evaluates operations sequentially: `2+3*4` gives `20`. **Mathematics mode** uses operator precedence and gives `14`. Parentheses use normal mathematical precedence in both modes and support nesting. Select a mode or tap Alt to switch; the expression and memory are retained. The existing `/#/` and `/#/mathematics` routes remain supported.

After `=`, a number starts a new calculation and an operator continues from the answer. BS removes the last character of the expression, including an operator or parenthesis. Invalid expressions and division by zero show a message and remain editable. Floating-point display artifacts are rounded to 14 significant digits.

M+ adds the current result to memory; M− subtracts it. MR recalls the stored number (inserted as a factor after another number). AC clears the calculation and preserves memory; MC clears memory.

## Keyboard assignments

Keyboard input works as soon as the page has focus, including after clicking calculator buttons or mode controls. Hover over a virtual key, or focus it with Tab, for a popup showing its function and shortcut.

| Virtual key | Keyboard |
| --- | --- |
| 0–9 | 0–9 (including numeric keypad) |
| ( | ← or ( |
| ) | → or ) |
| +, −, *, / | +, −, *, / |
| . | . or numeric keypad decimal |
| = | Enter or = |
| AC | Space bar |
| BS | Backspace or Delete |
| MR | End |
| M− | PageDown |
| M+ | PageUp |
| MC | Home |
| Switch mode | Alt |
| 00 | Ctrl |

Tap and release Ctrl or Alt **on its own** to activate its assignment. Modifier combinations such as Ctrl+C, Ctrl+R, and Alt+Tab retain their normal behavior. Holding a key does not repeatedly enter it, except Backspace/Delete. Browser and operating system shortcuts that move focus outside the page remain under browser/OS control. IME composition is ignored; use direct number input.

## Firebase hosting

Existing configuration targets project **calculator-bf6c7** (Calculator). To publish after reviewing the production build:

```sh
npm run build
firebase deploy --only hosting --project calculator-bf6c7
```

Local edits and checks do not publish the site or push GitHub changes.
