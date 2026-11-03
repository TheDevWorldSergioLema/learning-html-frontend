/**
 * @typedef {import('./editorTab.js').EditorTab[keyof import('./editorTab.js').EditorTab]} EditorTabValue
 * @typedef {import('./distanceUnit.js').DistanceUnit[keyof import('./distanceUnit.js').DistanceUnit]} DistanceUnitValue
 * @typedef {import('./buildIssue.js').BuildIssue[keyof import('./buildIssue.js').BuildIssue]} BuildIssueValue
 * @typedef {import('./lintWarning.js').LintWarning[keyof import('./lintWarning.js').LintWarning]} LintWarningValue
 * @typedef {import('./language.js').Language[keyof import('./language.js').Language]} LanguageValue
 */

/**
 * Its texts live in the translations, under `levels.<id>`. The `{{key}}` placeholders in its code are comments,
 * translated under `codeComments.<key>`.
 * @typedef {Object} Level
 * @property {string} id
 * @property {string} concept
 * @property {string} [example]
 * @property {string} html
 * @property {string} css
 * @property {string} [solutionHtml]
 * @property {string} [solutionCss]
 * @property {boolean} [htmlEditable]
 * @property {EditorTabValue} [startTab]
 */

/**
 * @typedef {Object} Code
 * @property {string} html
 * @property {string} css
 */

/**
 * Position relative to the baseplate, in pixels. `name` is null when the brick has no class besides `.brick`.
 * @typedef {Object} Brick
 * @property {string | null} name
 * @property {number} index
 * @property {number} x
 * @property {number} y
 * @property {number} w
 * @property {number} h
 * @property {string} color
 */

/**
 * @typedef {Object} Distance
 * @property {DistanceUnitValue} unit
 * @property {number} value
 */

/**
 * @typedef {Object} Issue
 * @property {BuildIssueValue} type
 * @property {Distance} [distance]
 * @property {string} [color]
 */

/**
 * @typedef {Object} BuildItem
 * @property {string | null} name
 * @property {number} index
 * @property {string} color
 * @property {boolean} ok
 * @property {boolean} [extra]
 * @property {Issue[]} issues
 */

/**
 * @typedef {Object} BuildResult
 * @property {boolean} done
 * @property {number} placed
 * @property {number} total
 * @property {BuildItem[]} items
 */

/**
 * @typedef {Object} CssWarning
 * @property {LintWarningValue} type
 * @property {number} [line]
 */

/**
 * @typedef {Object} Progress
 * @property {number} current
 * @property {string[]} completed
 * @property {Record<string, Code>} code
 * @property {Record<string, number>} hints
 */

export {}
