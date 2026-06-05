import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db/index'
import { isDue, STAGE_NAMES, STAGE_INTERVALS } from '../engines/leitner'
import { useStreak } from '../hooks/useStreak'

const BOX_COLORS = ['#e2e8f0', '#c4b5fd', '#818cf8', '#6c63ff', '#f59e0b', '#22c55e']

function BoxDistBar({ sentences }) {
  if (!sentences || sentences.length === 0) return null
  const total = sentences.length
  const unseen  = sentences.filter(s => !s.reps || s.reps === 0).length
  const boxes   = [1, 2, 3, 4, 5].map(b =>
    sentences.filter(s => s.box === b && (s.reps || 0) > 0).length
  )
  const counts  = [unseen, ...boxes]
  const studied = total - unseen
  const pct     = total > 0 ? Math.round((studied / total) * 100) : 0

  return (
    <div className="box-dist-wrap">
      <div className="box-dist-header">
        <span className="box-dist-title">学習進捗</span>
        <span className="box-dist-pct">{pct}% 学習済み</span>
      </div>
      <div className="box-dist-bar">
        {counts.map((c, i) =>
          c > 0 ? (
            <div
              key={i}
              className="box-dist-seg"
              style={{ flex: c, background: BOX_COLORS[i] }}
              title={`${STAGE_NAMES[i]}: ${c}文`}
            />
          ) : null
        )}
      </div>
      <div className="box-dist-legend">
        {counts.map((c, i) =>
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
    </div>
  )
}

export default function HomeScreen({ onStartDeck, onStartSRS, onOpenSettings, onOpenStats }) {
  const sentences = useLiveQuery(() => db.sentences.toArray(), [])
  const { streak } = useStreak()

  const total       = sentences?.length ?? 0
  const dueCount    = sentences?.filter(isDue).length ?? 0
  const studiedCount = sentences?.filter(s => (s.reps || 0) > 0).length ?? 0
  const masteredCount = sentences?.filter(s => s.box === 5).length ?? 0

  const greeting = (() => {
    const h = new Date().getHours()
    if (h < 5)  return '夜遅くまでお疲れ様'
    if (h < 11) return 'おはようございます'
    if (h < 18) return 'こんにちは'
    return 'お疲れ様です'
  })()

  return (
    <div className="home-screen">
      <header className="home-header">
        <div className="home-greeting">{greeting}</div>
        <h1 className="app-title">瞬英</h1>
        {streak > 0 && (
          <div className="streak-badge">🔥 {streak}日連続</div>
        )}
      </header>

      <button className="stats-row" onClick={onOpenStats} aria-label="学習の記録を見る">
        <div className="stat-card">
          <span className="stat-num">{total}</span>
          <span className="stat-label">総文数</span>
        </div>
        <div className={`stat-card ${dueCount > 0 ? 'highlight' : ''}`}>
          <span className="stat-num">{dueCount}</span>
          <span className="stat-label">復習待ち</span>
        </div>
        <div className="stat-card">
          <span className="stat-num">{masteredCount}</span>
          <span className="stat-label">習得済み</span>
        </div>
      </button>

      <BoxDistBar sentences={sentences} />

      <div className="mode-cards">
        <button className="mode-card deck" onClick={onStartDeck}>
          <div className="mode-icon">🔄</div>
          <div className="mode-info">
            <h3>デッキ周回</h3>
            <p>10文を全部○になるまでループ<br />型を体に染み込ませる</p>
          </div>
          <div className="mode-arrow">›</div>
        </button>

        <button className="mode-card srs" onClick={onStartSRS}>
          <div className="mode-icon">📅</div>
          <div className="mode-info">
            <h3>SRS復習</h3>
            <p>
              {dueCount > 0
                ? <><strong className="due-count">{dueCount}文</strong> 待っています</>
                : '今日の復習はありません'}
            </p>
          </div>
          <div className="mode-arrow">›</div>
        </button>
      </div>

      <button className="btn-settings" onClick={onOpenSettings}>
        ⚙ 設定・文の管理
      </button>
    </div>
  )
}
