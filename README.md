# Brick by Brick

A browser-only playground where students learn HTML and CSS by placing toy bricks on a baseplate.
The code editor is on the left, a browser-like preview on the right. Each of the 20 steps explains
one idea, shows dashed outlines where the bricks must go, checks the build live and offers hints.

| Steps | Concept | What it does to a brick |
| --- | --- | --- |
| 1–4 | `padding` | its size (an empty `<div>` is as big as its padding) |
| 5–7 | `background-color` | its color |
| 8–10 | `margin` | its position (space pushed around it) |
| 11–16 | `display: flex`, `justify-content`, `align-items`, `flex-direction` | rows and columns of bricks |
| 17–18 | `gap` | even space between bricks |
| 19–20 | HTML | adding bricks and nesting containers |

There is no backend: progress, code and hints are saved in the browser's `localStorage`.

## Run it

Requires Node.js 20.19+ (or 22.12+).

```sh
npm install
npm run dev        # http://localhost:5173 (also exposed on the network)
npm test           # unit and component tests (vitest + Testing Library, jsdom)
npm run lint       # eslint
npm run build      # static files in dist/
npm run preview    # serves dist/ on http://localhost:4173
```

`dist/` is a static site: it can be served by any web server, no runtime configuration needed.

## Deployment

Every push to `main` runs `.github/workflows/deploy.yml`: lint, tests and build, then `dist/` is published to
GitHub Pages at https://learning-html.sergiolema.dev.

One-time setup:

- DNS: a `CNAME` record `learning-html` → `thedevworldsergiolema.github.io.`
- GitHub, repo **Settings → Pages**: source **GitHub Actions**, custom domain `learning-html.sergiolema.dev`,
  then **Enforce HTTPS** once the certificate is issued

## Stack

- React 19, built with Vite
- CodeMirror 6 (`@uiw/react-codemirror`) for the HTML and CSS editors
- zustand for the application state
- i18next / react-i18next for every user-facing text (English only)
- SCSS for the styles, with the design tokens in `src/styles`
- Vitest, Testing Library and jsdom for the tests

## Architecture

```
src/
├── main.jsx            entry point: loads i18n and the global styles, renders the view
├── assets/             small images (icons, logos, backgrounds), when needed
├── components/         root components, shared by every feature
│   ├── button/         Button (primary, secondary, quiet)
│   ├── icons/          SVG icons as React components, drawn with currentColor
│   ├── rich-text/      RichText: text where `backticks` mark inline code
│   └── toggle/         Toggle switch
├── hooks/              shared hooks: useFitScale (scale a box to fit), useLatest (ref to the latest value)
├── i18n/               i18next setup and locales/en/translation.json
├── layout/             PublicLayout: top bar with the brand and the step strip
├── services/           progressService: reads and writes the progress in localStorage
├── stores/             progressStore (zustand): current step, completed steps, code and hints per step
├── styles/             _config.scss (tokens), _typography.scss, _mixins.scss, global.scss
├── test/               shared test setup, factories and render helpers
├── types/              enums (EditorTab, BuildIssue, LintWarning, DistanceUnit, ButtonVariant) and JSDoc entities
├── utils/              frame (preview iframe), compare (build check), cssLint (CSS warnings)
└── views/
    └── playground/     the only page, its components grouped by feature
        ├── PlaygroundView.jsx
        ├── levels.js   the 20 steps: starter code, solutions, examples
        ├── check/      BuildCheck: bricks in place, issues, warnings, success
        ├── editor/     CodeEditor: index.html / style.css tabs
        ├── lesson/     LessonPanel: explanation, goal, hints, solution
        ├── preview/    BrowserWindow (browser chrome, scaling) and LegoFrame (sandboxed iframe)
        └── steps/      StepStrip: the 20 steps as studs in the top bar
```

### Data flow

```
progressStore ──► PlaygroundView ──► LessonPanel, CodeEditor ──(edits)──► progressStore ──► progressService (localStorage)
                        │
                        ├──► LegoFrame (visible)  student code   ─┐
                        ├──► LegoFrame (hidden)   solution code  ─┼─► measured bricks ─► compareBuild ─► BuildCheck
                        └──► lintCss(student CSS) ─────────────────────────────────────────────────────► BuildCheck
```

`PlaygroundView` reads the current step from `levels.js` and the student's code from the store. It
renders both the student's code and the solution, compares the two sets of measured bricks, and marks
the step as completed in the store when they match.

### How a step is checked

1 stud = 20px; the baseplate is 400 × 280px.

- The student's code is written into a sandboxed iframe (no scripts) without reloading it
  (`src/utils/frame.js`).
- The step's solution is rendered in a hidden iframe the same way. The size, position and color of
  each `.brick` in it become the target: the dashed outlines and the reference for the check.
- `src/utils/compare.js` compares the bricks one by one, in HTML order, with a 1px tolerance, and
  returns structured issues (`BuildIssue` with a distance or a color), which `BuildCheck` turns into
  sentences through i18n ("2 studs too far left", "should be blue").
- `src/utils/cssLint.js` points out the usual reasons why nothing happens: a missing `;`, `:` or unit,
  or an unclosed `{`. It returns `LintWarning` values, translated in `BuildCheck`.

Because the target comes from the solution, any CSS that produces the same build passes.

### Styles

Every color, spacing, radius, shadow and breakpoint is a token in `src/styles/_config.scss`, every font
family, size, weight and line height in `src/styles/_typography.scss`. Each component has its own
`.scss` file next to it, which `@use`s them (Vite adds `src/styles` to the SCSS load paths, so
`@use 'config' as *;` works from anywhere). The CodeMirror theme is defined in JS, so the few tokens
it needs are exposed as CSS custom properties in `global.scss`.

The preview iframe is a separate document: its look (baseplate, bricks, studs) is defined in
`src/utils/frame.js`.

## Adding or changing a step

- Code lives in `src/views/playground/levels.js`: the starter `html`/`css`, a `solutionCss` and/or
  `solutionHtml`, an optional `example`, the `concept` badge, `htmlEditable: true` when the student
  must write HTML and `startTab` to open the HTML tab first.
- Texts live in `src/i18n/locales/en/translation.json` under `levels.<id>`: `title`, `intro`
  (paragraphs), `goal`, progressive `hints` and the `recap` shown on success. They accept
  `` `inline code` ``.

`levels.test.js` checks that every step has a solution that changes something and all its texts.
