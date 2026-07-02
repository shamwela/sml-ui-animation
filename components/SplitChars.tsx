/**
 * Splits text into per-character spans at render time (server-safe, so
 * server and client HTML always match — no SplitText runtime cost).
 * Animate the `[data-char]` spans; screen readers get the full string.
 */
export const SplitChars = ({
  text,
  className,
  charClassName,
}: {
  text: string
  className?: string
  charClassName?: string
}) => {
  return (
    <span aria-label={text} className={className}>
      {Array.from(text).map((char, index) => (
        <span
          key={index}
          aria-hidden='true'
          data-char
          className={`inline-block ${charClassName ?? ''}`}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  )
}
