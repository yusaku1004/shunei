function fmtTime(sec) {
  if (sec < 60) return `${sec}秒`
  return `${Math.floor(sec / 60)}分${sec % 60}秒`
}

export default function SRSComplete({ stats = {}, onHome }) {
  const { correct = 0, total = 0, maxCombo = 0, duration = 0 } = stats
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0
  const noDue = total === 0

  return (
    <div className="complete-screen">
      <div className="complete-icon">{noDue ? '✅' : accuracy >= 80 ? '🌟' : '💪'}</div>
      <h2 className="complete-title">{noDue ? '今日の復習なし' : '復習完了！'}</h2>
      <p className="complete-sub">
        {noDue
          ? '今日期限のカードはありません。デッキ周回で練習しましょう。'
          : `${total}文を復習しました`}
      </p>

      {total > 0 && (
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
            <span className="stat-tile-num">{correct}</span>
            <span className="stat-tile-label">正解数</span>
          </div>
        </div>
      )}

      <div className="complete-actions">
        <button className="btn-primary" onClick={onHome}>ホームへ</button>
      </div>
    </div>
  )
}
