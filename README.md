# Calculator

A Vue calculator designed for desktop and landscape phones, styled after `calculator23.jpg`. Both modes share one calculator and memory register.

## Develop and verify

Use Node.js 24 or later (`nvm use` selects Node.js 24). This project uses Vue 3, Vue Router 5, Vite 8, and ESLint 10, with stable dependency versions recorded in `package-lock.json`.

```sh
npm ci
npm run serve
npm test
npm run lint -- --no-fix
npm run build
```

`npm run dev` is an alias for `npm run serve`. Both start the Vite development server. `npm run preview` serves a production build locally after building it. Lint checks files without modifying them; use `npm run lint -- --fix` to apply automatic fixes.

The Vue 3 migration replaces Vue CLI, webpack, Babel, and the legacy OpenSSL wrapper with Vite. The HTML entry point is now `index.html` in the project root; static assets remain in `public`. The unused Lodash dependency has been removed. Builds target modern browsers using Vite's default browser target; Internet Explorer is not supported. See the [Vue tooling guide](https://vuejs.org/guide/scaling-up/tooling.html) and [Vite browser compatibility](https://vite.dev/guide/build.html#browser-compatibility).

Production files are generated in `dist`. If an existing `dist` belongs to another user, build into a writable location instead:

```sh
npm run build -- --outDir /tmp/calculator-build
```

## Display and calculation modes

The three horizontal display rows show:

1. **Expression history** — the full input, with automatic parentheses showing sequential evaluation in Calculator mode and `=` added when finalized.
2. **Working expression** — completed parentheses and sequential subtotals are reduced as you type.
3. **Live result** — the result of a complete expression; Enter finalizes it.

For example, `(12+89-88)*56` displays `(12+89-88)*56`, `13*56`, and `728`.

Below the status/message row and input history, the working expression and live result use the original interface font at 48px on desktop, with smaller sizes on phones. Tabular numerals keep digits equally spaced where the font supports them. Numbers align on the right, and long expressions scroll horizontally with the most recent input brought into view.

The blue **SEP** button directly below **BS**, or the **S** key, toggles apostrophe thousands separators (`123'456'789`). Separators start enabled; the button's underline indicates they are on. This preference applies to the working expression (Line 3), the result (Line 4), and memory, and is retained when switching modes or clearing a calculation. Input history (Line 2) always shows input without thousands separators. Calculation and editing use the original unformatted values.

The **Digits** selector to the left of **SEP** controls significant digits in both the working expression (Line 3) and quick view (Line 4): **Full**, **10**, **16** (the default), **20**, or **30**. Full shows every available digit. Numeric settings round half up; large and small values use scientific notation when appropriate. No approximation marker is shown. For example, after `1234567890123456789+1=`, both rows show `1.234567890 × 10¹⁸` with 10 digits. While entering an expression, each numeric operand or subtotal on Line 3 follows the selected precision; operators and parentheses remain visible. Calculations, continued answers, and memory always use the full value. Changing digits updates both rows immediately, and the selection survives AC and mode changes. Input history (Line 2) and memory display retain their full precision. The selector supports native keyboard navigation without triggering calculator keys.

**Calculator mode** evaluates operations sequentially: `2+3*4` gives `20`. **Mathematics mode** uses operator precedence and gives `14`. Parentheses use normal mathematical precedence in both modes and support nesting. Select a mode or tap Alt to switch; changing modes clears the calculation and memory. Browser back/forward navigation between modes does the same. Selecting the already active mode does not reset anything. The existing `/#/` and `/#/mathematics` routes remain supported.

In Calculator mode, Line 2 automatically adds parentheses before multiplication or division when needed to show this sequential order: typing `2+3*5` displays `(2+3)*5`, and continuing with `-15/2` displays `((2+3)*5-15)/2`. Addition/subtraction alone, such as `2+3-6+7`, stays as typed. The display preserves manually entered parentheses, including their normal mathematical precedence. Backspace edits the original input and regenerates the display. Mathematics mode shows input without automatic parentheses.

After `=`, a number starts a new calculation and an operator continues from the answer. BS removes the last character of the expression, including an operator or parenthesis. Invalid expressions and division by zero show a message and remain editable. Calculations use decimal.js with 512 significant digits of precision, matching the input length limit, and retain the existing numeric range. Results exceeding that precision, including recurring quotients, are rounded. Input, answers, and memory remain decimal strings outside the arithmetic engine, so large numbers are not converted to JavaScript's binary floating-point numbers or rounded to 14 digits for display. For example, `1234567890123456789+1` gives `1234567890123456790` in both modes and on both result rows after `=` with Digits set to Full.

Memory starts at zero when the calculator loads and persists between calculations. M+ adds the current result to memory; M− subtracts it. Both evaluate a pending expression first, finish the calculation, and leave its result visible on Lines 3 and 4. Typing a digit, decimal point, or opening parenthesis next starts a new calculation; an operator continues from the displayed result. Repeating M+ or M− accumulates the displayed value again. Line 1 shows the memory value only when it is nonzero, including negative values; the indicator disappears when the register returns to zero. MR recalls the stored number, including zero (inserted as a factor after another number). AC clears the calculation and preserves memory; MC clears memory and preserves the current calculation. Invalid expressions leave memory unchanged and remain editable.

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
| SEP (thousands separators on/off) | S |
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

## Automatic deployment after merging a PR

`.github/workflows/firebase-deploy.yml` deploys the latest `master` to the live Firebase Hosting site **only after a pull request targeting `master` is merged**. Opening or updating a PR, closing a PR without merging, merging into another branch, and directly pushing commits do not deploy. There are no automatic preview deployments or manual deployment triggers.

The workflow installs locked dependencies with Node.js 24, runs tests and lint, builds `dist`, and deploys only if every preceding step succeeds. Deployments run one at a time. The `pull_request_target` trigger supports merged PRs from forks; its merged-only guard and explicit checkout of `master` ensure it never builds an unmerged PR branch with deployment credentials. Keep both restrictions when editing the workflow.

### One-time credential setup

1. Open [Google Cloud service accounts for calculator-bf6c7](https://console.cloud.google.com/iam-admin/serviceaccounts?project=calculator-bf6c7).
2. Create a dedicated account, such as `github-calculator-deploy`, in that project. Grant **Firebase Hosting Admin** (`roles/firebasehosting.admin`) and **API Keys Viewer** (`roles/serviceusage.apiKeysViewer`). This app serves static files; it does not need Firebase Authentication or Cloud Run access.
3. Open that service account, choose **Keys → Add key → Create new key → JSON**, and download the JSON key. If organization policy prevents creating keys, ask your administrator for an approved deployment identity setup.
4. Open the repository's [Actions secrets settings](https://github.com/SoichiroWada/calculator-vue/settings/secrets/actions), choose **New repository secret**, name it **`FIREBASE_SERVICE_ACCOUNT_CALCULATOR_BF6C7`**, and paste the entire JSON file as its value. Keep the JSON key outside the repository and do not commit it.
5. Commit and push the workflow and this documentation on your feature branch, then open a PR targeting `master` and merge it. The workflow must be present on `master` for subsequent merged PR events. Check the [Actions tab](https://github.com/SoichiroWada/calculator-vue/actions) for the deployment result.

After a successful deployment, the app is available at https://calculator-bf6c7.web.app and https://calculator-bf6c7.firebaseapp.com.

To enforce the PR process for changes to `master` as well, configure a branch protection rule or ruleset requiring a pull request before merging. This workflow controls deployment triggers; it does not block direct pushes itself.

References: [GitHub merge-event conditions](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#pull_request_target), [Firebase Hosting GitHub integration](https://firebase.google.com/docs/hosting/github-integration), and [Firebase deploy action service-account setup](https://github.com/FirebaseExtended/action-hosting-deploy/blob/main/docs/service-account.md).
