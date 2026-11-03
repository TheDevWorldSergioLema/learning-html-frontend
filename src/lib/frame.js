// The preview is a sandboxed iframe (no scripts) whose document the app writes into
// directly: the student's HTML goes inside `.baseplate`, their CSS into `#user-css`.
// Updating in place, instead of reloading the frame, keeps the preview flicker-free.

export const STUD = 20
export const FRAME_WIDTH = 440
export const FRAME_HEIGHT = 320
export const UNPAINTED = 'rgb(217, 187, 123)'

const STUDS = (light, dark) =>
  `radial-gradient(circle at 10px 10px, ${light} 0 5px, ${dark} 5.5px 6.5px, transparent 7px)`

// Rules the student never sees: the look of the baseplate and of the bricks.
// Layout rules the student relies on (display: flex; align-items: flex-start) are
// mentioned in the starter CSS of each flex level.
const BASE_CSS = `
html, body { margin: 0; height: 100%; }
body { display: flex; align-items: center; justify-content: center; background: #f3f5f8; }
.baseplate {
  width: 400px; height: 280px; flex-shrink: 0;
  display: flex; align-items: flex-start;
  background-color: #c5cbd3;
  background-image: ${STUDS('#d3d8de', '#a9b0b9')};
  background-size: ${STUD}px ${STUD}px;
  border-radius: 3px;
  box-shadow: 0 3px 0 #98a0aa, 0 10px 24px rgba(27, 40, 56, 0.18);
}
.brick {
  position: relative; flex-shrink: 0;
  background-color: ${UNPAINTED};
  border-radius: 2px;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.18), inset 0 -3px 0 rgba(0, 0, 0, 0.16);
}
.brick::after {
  content: ""; position: absolute; inset: 0; pointer-events: none;
  background-image: ${STUDS('rgba(255, 255, 255, 0.32)', 'rgba(0, 0, 0, 0.22)')};
  background-size: ${STUD}px ${STUD}px;
}
#__ghosts { position: absolute; top: 0; left: 0; pointer-events: none; }
#__ghosts > b {
  position: absolute; box-sizing: border-box; border-radius: 2px;
  border: 2px dashed rgba(27, 40, 56, 0.8);
}
#__ghosts > b > i { position: absolute; inset: 0; opacity: 0.32; }
`

export const SKELETON = `<!doctype html><html><head><meta charset="utf-8">
<style>${BASE_CSS}</style><style id="user-css"></style></head>
<body><div class="baseplate"></div><div id="__ghosts"></div></body></html>`

export function render(doc, html, css) {
  doc.getElementById('user-css').textContent = css
  doc.querySelector('body > .baseplate').innerHTML = html
}

function brickName(el, index) {
  const own = [...el.classList].find((c) => c !== 'brick')
  return own ?? `brick ${index + 1}`
}

function plateOrigin(doc) {
  const plate = doc.querySelector('body > .baseplate')
  const rect = plate.getBoundingClientRect()
  return { plate, left: rect.left + plate.clientLeft, top: rect.top + plate.clientTop }
}

/** Size, position (relative to the baseplate) and color of every brick, in HTML order. */
export function measure(doc) {
  const { plate, left, top } = plateOrigin(doc)
  return [...plate.querySelectorAll('.brick')].map((el, i) => {
    const r = el.getBoundingClientRect()
    return {
      name: brickName(el, i),
      x: Math.round(r.left - left),
      y: Math.round(r.top - top),
      w: Math.round(r.width),
      h: Math.round(r.height),
      color: doc.defaultView.getComputedStyle(el).backgroundColor,
    }
  })
}

/** Dashed outlines where the target bricks go; bricks already in place get none. */
export function drawGhosts(doc, target, placed, visible) {
  const layer = doc.getElementById('__ghosts')
  layer.replaceChildren()
  if (!visible || !target) return
  const { left, top } = plateOrigin(doc)
  const win = doc.defaultView
  target.forEach((t, i) => {
    if (placed[i]) return
    const ghost = doc.createElement('b')
    ghost.style.cssText = `left:${left + win.scrollX + t.x}px;top:${top + win.scrollY + t.y}px;width:${t.w}px;height:${t.h}px`
    const fill = doc.createElement('i')
    fill.style.backgroundColor = t.color
    ghost.append(fill)
    layer.append(ghost)
  })
}
