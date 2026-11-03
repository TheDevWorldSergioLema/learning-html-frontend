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

```sh
npm install
npm run dev      # http://localhost:5173
npm test         # unit tests (vitest)
npm run lint
npm run build    # static files in dist/
```

## How a step is checked

1 stud = 20px; the baseplate is 400 × 280px.

- The student's code is written into a sandboxed iframe (no scripts) without reloading it
  (`src/lib/frame.js`).
- The step's solution is rendered in a hidden iframe the same way. The size, position and color of
  each `.brick` in it become the target: the dashed outlines and the reference for the check.
- `src/lib/compare.js` compares the bricks one by one, in HTML order, with a 1px tolerance, and turns
  each difference into a sentence ("2 studs too far left", "should be blue").
- `src/lib/cssLint.js` points out the usual reasons why nothing happens: a missing `;`, `:` or unit,
  or an unclosed `{`.

Because the target comes from the solution, any CSS that produces the same build passes.

## Adding or changing a step

Steps live in `src/levels/levels.js`. Each one has the starter `html`/`css`, a `solutionCss`
and/or `solutionHtml`, the explanation (`intro`, `example`, `goal`), progressive `hints` and a
`recap` shown on success. Text fields accept `` `inline code` ``. Set `htmlEditable: true` when the
student must write HTML.
