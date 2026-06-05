import { useEffect, useMemo, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, getDailyCounts, dateKey } from '../db/index'
import { useStreak } from '../hooks/useStreak'
import { STAGE_NAMES, STAGE_INTERVALS } from '../engines/leitner'

const BOX_COLORS = ['#e2e8f0', '#c4b5fd', '#818cf8', '#6c63ff', '#f59e0b', '#22c55e']
const HEAT_WEEKS = 14

function heatLevel(n) {
  if (!n) return 0
  if (n < 10) return 1
  if (n < 25) return 2
  if (n < 50) return 3
  return 4
}

export default function StatsScreen({ onBack }) {
  const sentences = useLiveQuery(() => db.sentences.toArray(), [])
  const { streak } = useStreak()
  const [counts, setCounts] = useState({})

  useEffect(() => { getDailyCounts().then(setCounts) }, [])

  const total = sentences?.length ?? 0
  const studied = sentences?.filter((s) => (s.reps || 0) > 0).length ?? 0
  const mastered = sentences?.filter((s) => s.box === 5).length ?? 0
  const totalReps = sentences?.reduce((a, s) => a + (s.reps || 0), 0) ?? 0

  // Box distribution
  const boxData = useMemo(() => {
    if (!sentences) return []
    const unseen = sentences.filter((s) => !s.reps).length
    const boxes = [1, 2, 3, 4, 5].map((b) => sentences.filter((s) => s.box === b && s.reps > 0).length)
    return [unseen, ...boxes]
  }, [sentences])

  // Heatmap cells (last HEAT_WEEKS weeks, column = week, row = Sun..Sat)
  const { cells, activeDays, todayTotal } = useMemo(() => {
    const days = HEAT_WEEKS * 7
    const end = new Date()
    const start = new Date(end)
    start.setDate(end.getDate() - (days - 1))
    const lead = start.getDay() // pad so first cell lands on Sunday
    const out = []
    for (let i = 0; i < lead; i++) out.push(null)
    let active = 0
    for (let i = 0; i < days; i++) {
      const d = new Date(start)
      d.setDate(start.getDate() + i)
      const key = dateKey(d)
      const n = counts[key] || 0
      if (n > 0) active++
      out.push({ key, n, level: heatLevel(n) })
    }
    return { cells: out, activeDays: active, todayTotal: counts[dateKey(end)] || 0 }
  }, [counts])

  return (
    <div className="settings-screen">
      <div className="settings-header">
        <button className="btn-back" onClick={onBack}>← 戻る</button>
        <h2>学習の記録</h2>
      </div>

      <section className="settings-section">
        <div className="stats-grid">
          <div className="stat-tile">
            <span className="stat-tile-num">🔥 {streak}</span>
            <span className="stat-tile-label">連続日数</span>
          </div>
          <div className="stat-tile">
            <span className="stat-tile-num">{todayTotal}</span>
            <span className="stat-tile-label">今日の学習</span>
          </div>
          <div className="stat-tile">
            <span className="stat-tile-num">{studied}/{total}</span>
            <span className="stat-tile-label">学習済み</span>
          </div>
          <div className="stat-tile">
            <span className="stat-tile-num">{mastered}</span>
            <span className="stat-tile-label">習得済み</span>
          </div>
          <div className="stat-tile">
            <span className="stat-tile-num">{totalReps}</span>
            <span className="stat-tile-label">累計採点</span>
          </div>
          <div className="stat-tile">
            <span className="stat-tile-num">{activeDays}</span>
            <span className="stat-tile-label">学習した日</span>
          </div>
        </div>
      </section>

      {/* Heatmap */}
      <section className="settings-section">
        <h3>学習ヒートマップ（直近{HEAT_WEEKS}週）</h3>
        <div className="heatmap">
          {cells.map((c, i) =>
            c === null
              ? <span key={`b${i}`} className="heat-cell blank" />
              : <span key={c.key} className={`heat-cell lv${c.level}`} title={`${c.key}: ${c.n}文`} />
          )}
        </div>
        <div className="heat-legend">
          <span>少</span>
          {[0, 1, 2, 3, 4].map((l) => <span key={l} className={`heat-cell lv${l}`} />)}
          <span>多</span>
        </div>
      </section>

      {/* Box distribution */}
      <section className="settings-section">
        <h3>定着段階の分布</h3>
        {total > 0 && (
          <>
            <div className="box-dist-bar" style={{ marginBottom: 12 }}>
              {boxData.map((c, i) =>
                c > 0 ? <div key={i} className="box-dist-seg" style={{ flex: c, background: BOX_COLORS[i] }} /> : null
              )}
            </div>
            <div className="box-dist-legend">
              {boxData.map((c, i) =>
                c > 0 ? (
                  <div key={i} className="box-legend-item">
                    <span className="box-dot" style={{ background: BOX_COLORS[i] }} />
                    <span className="box-legend-label">{STAGE_NAMES[i]}</span>
                    {i > 0 && <span className="box-legend-interval">{STAGE_INTERVALS[i]}</span>}
                    <span className="box-legend-count">{c}</span>
                  </div>
                ) : null
              )}
            </div>
          </>
        )}
      </section>
    </div>
  )
}
