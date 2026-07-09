import PromotionSummary from './PromotionSummary'

function fmtTime(sec) {
  if (sec < 60) return `${sec}秒`
  return `${Math.floor(sec / 60)}分${sec % 60}秒`
}

export default function DeckComplete({ deck, stats = {}, boxMoves, onRestart, onHome }) {
  const { correct = 0, total = 0, maxCombo = 0, duration = 0 } = stats
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0

  return (
    <div className="complete-screen">
      <div className="complete-icon">{accuracy >= 80 ? '🏆' : '💪'}</div>
      <h2 className="complete-title">デッキ完了！</h2>
      <p className="complete-sub">{deck.length}文すべて○になりました</p>

      <div className="stats-grid">
        <div className="stat-tile">
          <span className="stat-tile-num">{accuracy}%</span>
          <span className="stat-tile-label">正答率</span>
        </div>
        <div className="stat-tile">
          <span className="stat-tile-num">🔥 {maxCombo}</span>
          <span className="stat-tile-label">最大コンボ</span>
        </div>
        <div className="stat-tile">
          <span className="stat-tile-num">{fmtTime(duration)}</span>
          <span className="stat-tile-label">所要時間</span>
        </div>
        <div className="stat-tile">
          <span className="stat-tile-num">{total}</span>
          <span className="stat-tile-label">採点回数</span>
        </div>
      </div>

      <PromotionSummary boxMoves={boxMoves} />

      <div className="complete-actions">
        <button className="btn-primary" onClick={onRestart}>次のデッキへ →</button>
        <button className="btn-ghost" onClick={onHome}>ホームへ</button>
      </div>
    </div>
  )
}
