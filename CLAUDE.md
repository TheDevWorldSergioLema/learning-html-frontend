# Brick by Brick: frontend

Browser-only React app (Vite) that teaches HTML and CSS with toy bricks. No backend: progress is stored
in `localStorage`. See `README.md` for how to run it and for the architecture.

## Commands

```sh
npm run dev      # dev server on http://localhost:5173
npm test         # vitest (jsdom)
npm run lint     # eslint
npm run build    # production build in dist/
```

Run `npm test`, `npm run lint` and `npm run build` before reporting a change as done.

## Guidelines

- Avoid adding unnecessary comments, take into account I'm an experienced developer
- Components are grouped by feature
- No hard-coded user-facing text: every label, placeholder, attribute text (`title`, `aria-label`, `alt`), toast and error message goes through i18n, in every locale (`src/i18n/locales/<en|fr|es|it|de>/translation.json`, English is the default)
- The test suites must have at least two levels: first level is the name of the class/component, second level is the name of the test or another group of tests
- The `src` folder has the following structure:
  - assets with small images (icons, logos, background images)
  - components with the root components (buttons, inputs, dropdown...)
  - hooks with the shared React hooks
  - i18n with the translations: English, French, Spanish, Italian and German
  - layout with the private and public layouts
  - services to access the backend with or without the authentication
  - stores to manage the state of the application
  - styles with the style definition of all the design tokens: the style values are in `src/styles/_config.scss`, the typography definitions in `src/styles/_typography.scss`
  - types with all the entities and enums definitions
  - utils with the shared helper functions
  - views with all the pages
  - test with the shared test setup and helpers
- Never hard-code a color, spacing, radius or font that exists as a token in `src/styles/_config.scss` / `_typography.scss`; add a token when a new value is needed
- The SVG must be created inside components/icons as React components, with currentColor instead of hard coded colors
- Prefer using fluent method chaining for request calls (with then, catch and finally), instead of try-catch blocks
- Sort the definitions on each component as following:
  - first the context declaration (useTranslation, useNavigation...)
  - the useState variables
  - the useEffect
  - the constants
  - the useMemo
  - the private methods
  - the partial renders
  - the return statement

## Project specifics

- The project is plain JavaScript: entities are JSDoc typedefs in `src/types/entities.js`, enums are frozen objects in `src/types/*.js`.
- Utils return structured values (`BuildIssue`, `LintWarning`, `Distance`), never sentences: components translate them.
- A step's code lives in `src/views/playground/levels.js`, its texts in the translations under `levels.<id>` (`title`, `intro`, `goal`, `hints`, `recap`), the definition of its concept under `concepts.<concept>`. Neither the definition nor the intro may give the solution away: code close to the solution belongs in the hints (`example` is shown as the hint before the last one). Text fields accept `` `inline code` `` rendered by `RichText`, kept identical in every language.
- Comments inside a step's code are `/* {{key}} */` placeholders, translated under `codeComments.<key>` and filled with `fillComments`.
- Each component has its own `.scss` file next to it, starting with `@use 'config' as *;` (and `typography`, `mixins` when needed). Only `global.scss` defines global rules and the CSS custom properties used by the CodeMirror theme.
- The preview iframe (`src/utils/frame.js`) is a separate document: its baseplate and brick styles cannot use the SCSS tokens. `$color-preview-background` must stay equal to its body background.
- jsdom does not load an iframe's `srcdoc`: `LegoFrame` is tested with `utils/frame.js` mocked and a fired `load` event; `PlaygroundView` cannot be rendered in tests.
