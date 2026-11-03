/** The 20 steps as a row of studs: filled when done, outlined when current. */
export function StepStrip({ levels, current, completed, onSelect }) {
  return (
    <nav className="steps" aria-label="Steps">
      <ol>
        {levels.map((level, i) => {
          const done = completed.includes(level.id)
          return (
            <li key={level.id}>
              <button
                type="button"
                className={`stud${done ? ' is-done' : ''}`}
                aria-current={i === current ? 'step' : undefined}
                aria-label={`Step ${i + 1}: ${level.title}${done ? ', done' : ''}`}
                title={`${i + 1}. ${level.title}`}
                onClick={() => onSelect(i)}
              >
                {i + 1}
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
