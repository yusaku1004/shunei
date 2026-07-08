import { useMemo } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db/index'
import { getUpcomingDue, formatDueDays } from '../engines/leitner'
import { getStudyTag } from '../studyPrefs'

function fmtTime(sec) {
  if (sec < 60) return `${sec}秒`
  return `${Math.floor(sec / 60)}分${sec % 60}秒`
}

export default function SRSComplete({ stats = {}, onHome, onStartDeck }) {
  const { correct = 0, total = 0, maxCombo = 0, duration = 0 } = stats
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0
  const noDue = total === 0

  // 採点後の最新状態から次回の復習予定を算出
  const sentences = useLiveQuery(() => db.sentences.toArray(), [])
  const upcoming = useMemo(() => {
    const tag = getStudyTag()
    const pool = (sentences ?? []).filter((s) => !tag || s.tag === tag)
    return getUpcomingDue(pool)
  }, [sentences])

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

      {upcoming.length > 0 && (
        <p className="next-due-note">
          📅 次の復習: {upcoming.map((u) => `${formatDueDays(u.days)} ${u.count}文`).join('・')}
        </p>
      )}

      <div className="complete-actions">
        <button className="btn-primary" onClick={onStartDeck}>② デッキ周回で練習する →</button>
        <button className="btn-ghost" onClick={onHome}>ホームへ</button>
      </div>
    </div>
  )
}
