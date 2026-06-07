import { useState, useMemo, useEffect } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db/index'
import { isDue, STAGE_NAMES, STAGE_INTERVALS } from '../engines/leitner'
import { useStreak } from '../hooks/useStreak'
import { getStudyTag, setStudyTag } from '../studyPrefs'

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
  const [tag, setTag] = useState(getStudyTag)

  const deckSize    = Number(localStorage.getItem('shunei_decksize')) || 7
  const total       = sentences?.length ?? 0
  // 文法で絞った「いま学習対象」の文
  const inScope     = sentences?.filter(s => !tag || s.tag === tag) ?? []
  const dueCount    = inScope.filter(isDue).length
  const tags        = useMemo(() => [...new Set((sentences ?? []).map(s => s.tag))].sort(), [sentences])
  const masteredCount = sentences?.filter(s => s.box === 5).length ?? 0

  function selectTag(t) {
    const next = t && tag === t ? null : t // 同じタグを再タップで解除
    setTag(next)
    setStudyTag(next)
  }

  // 選択中のタグの文が無くなった場合（例: 全削除）は「すべて」に戻す
  useEffect(() => {
    if (tag && sentences && !tags.includes(tag)) {
      setTag(null)
      setStudyTag(null)
    }
  }, [tag, tags, sentences])

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
          <div className="streak-badge">
            <svg className="streak-ico" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 23c4.4 0 7-3 7-6.5 0-2.6-1.5-4.7-2.7-6.2-.3 1.2-1 2-1.8 2.4.2-2.3-.7-5.1-3.5-7.7-.3 2.6-1.6 4-3 5.6C6.4 11.6 5 13.6 5 16.5 5 20 7.6 23 12 23z" />
            </svg>
            {streak}日連続
          </div>
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

      <div className="grammar-filter">
        <span className="level-filter-label">文法</span>
        <div className="grammar-chips">
          <button className={`gchip ${!tag ? 'active' : ''}`} onClick={() => selectTag(null)}>
            すべて
          </button>
          {tags.map((t) => (
            <button
              key={t}
              className={`gchip ${tag === t ? 'active' : ''}`}
              onClick={() => selectTag(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="mode-cards">
        <button className="mode-card deck" onClick={onStartDeck}>
          <div className="mode-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
              <path d="M21 3v5h-5" />
              <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
              <path d="M3 21v-5h5" />
            </svg>
          </div>
          <div className="mode-info">
            <h3>デッキ周回</h3>
            <p>{deckSize}文を全部○になるまでループ<br />型を体に染み込ませる</p>
          </div>
          <div className="mode-arrow">›</div>
        </button>

        <button className="mode-card srs" onClick={onStartSRS}>
          <div className="mode-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M16 2v4M8 2v4M3 10h18" />
              <path d="M9 16l2 2 4-4" />
            </svg>
          </div>
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
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
        設定・文の管理
      </button>
    </div>
  )
}
