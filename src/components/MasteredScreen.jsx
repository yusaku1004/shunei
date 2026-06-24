import { useState, useMemo } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db/index'
import { useTTS } from '../hooks/useTTS'

// box === 5（「習得済み」ステージ）に到達した英文の一覧。
export default function MasteredScreen({ onBack }) {
  const sentences = useLiveQuery(() => db.sentences.where('box').equals(5).toArray(), [])
  const [filterTag, setFilterTag] = useState('all')
  const { speak } = useTTS()

  const tags = useMemo(
    () => [...new Set((sentences || []).map((s) => s.tag))].sort(),
    [sentences]
  )

  const filtered = useMemo(() => {
    if (!sentences) return []
    if (filterTag === 'all') return sentences
    return sentences.filter((s) => s.tag === filterTag)
  }, [sentences, filterTag])

  return (
    <div className="settings-screen">
      <div className="settings-header">
        <button className="btn-back" onClick={onBack}>← 戻る</button>
        <h2>習得済みの英文</h2>
      </div>

      {!sentences || sentences.length === 0 ? (
        <section className="settings-section">
          <p className="manager-empty">
            まだ習得済みの英文はありません。<br />
            SRS復習で「もう少し」の文を○にすると習得済みになります。
          </p>
        </section>
      ) : (
        <>
          <section className="settings-section">
            <div className="manager-tag-filter">
              <button
                className={`filter-chip ${filterTag === 'all' ? 'active' : ''}`}
                onClick={() => setFilterTag('all')}
              >
                すべて ({sentences.length})
              </button>
              {tags.map((t) => (
                <button
                  key={t}
                  className={`filter-chip ${filterTag === t ? 'active' : ''}`}
                  onClick={() => setFilterTag(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </section>

          <section className="settings-section">
            <h3>{filtered.length}件の英文</h3>
            <div className="manager-list">
              {filtered.map((s) => (
                <div key={s.id} className="manager-item">
                  <div className="manager-item-text">
                    <p className="manager-jp">{s.jp}</p>
                    <p className="manager-en">{s.en}</p>
                    <div className="manager-item-meta">
                      <span className="tag-chip">{s.tag}</span>
                      <span className="level-dots">{'●'.repeat(s.level)}{'○'.repeat(4 - s.level)}</span>
                    </div>
                  </div>
                  <div className="manager-actions">
                    <button className="icon-btn" onClick={() => speak(s.en)} aria-label="英語を読み上げ">🔊</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  )
}
