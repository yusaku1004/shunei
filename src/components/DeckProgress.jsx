export default function DeckProgress({ deck, results }) {
  const good = deck.filter((s) => results[s.id] === 'good').length
  const hard = deck.filter((s) => results[s.id] === 'hard').length
  const again = deck.filter((s) => results[s.id] === 'again').length
  const pct = deck.length > 0 ? (good / deck.length) * 100 : 0

  return (
    <div className="deck-progress">
      <div className="progress-bar-wrap">
        <div className="progress-bar" style={{ width: `${pct}%` }} />
      </div>
      <div className="progress-counts">
        <span className="count good">○ {good}</span>
        <span className="count hard">△ {hard}</span>
        <span className="count again">× {again}</span>
        <span className="count total">/ {deck.length}</span>
      </div>
    </div>
  )
}
