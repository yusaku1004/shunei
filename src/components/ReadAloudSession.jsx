import { useState, useEffect } from 'react'
import { db } from '../db/index'
import { buildDeck } from '../engines/deckCycle'
import { getStudyTag } from '../studyPrefs'
import { useStreak } from '../hooks/useStreak'
import { useTTS } from '../hooks/useTTS'

// 森沢メソッドの「①音読」フェーズ。
// 日本語と英語を同時に見ながら、音声を聞いて声に出してリピートし、
// 文型を体に刷り込む。採点はせず（SRSには影響しない）、セットを周回する。
const REPEAT_TARGET = 3

function getTTSRate() {
  return Number(localStorage.getItem('shunei_ttsrate')) || 0.9
}

export default function ReadAloudSession({ onHome, onStartDeck }) {
  const [deck, setDeck] = useState([])
  const [idx, setIdx] = useState(0)
  const [repeat, setRepeat] = useState(0)
  const [loading, setLoading] = useState(true)
  const [complete, setComplete] = useState(false)
  const [cycle, setCycle] = useState(1)
  const { recordStudy } = useStreak()
  const { speak, stop } = useTTS()

  useEffect(() => {
    recordStudy()
    init()
    return () => stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function init() {
    setLoading(true)
    const all = await db.sentences.toArray()
    const tag = getStudyTag()
    const pool = tag ? all.filter((s) => s.tag === tag) : all
    const size = Number(localStorage.getItem('shunei_decksize')) || 7
    setDeck(buildDeck(pool, size))
    setIdx(0)
    setRepeat(0)
    setComplete(false)
    setLoading(false)
  }

  const card = deck[idx] ?? null

  // カードが変わったら英語を自動再生し、リピート数をリセット
  useEffect(() => {
    if (!card) return
    setRepeat(0)
    speak(card.en, 'en-US', getTTSRate())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [card?.id])

  function doRepeat() {
    if (!card) return
    speak(card.en, 'en-US', getTTSRate())
    setRepeat((c) => Math.min(c + 1, REPEAT_TARGET))
  }

  function next() {
    stop()
    if (idx + 1 >= deck.length) { setComplete(true); return }
    setIdx((i) => i + 1)
  }

  function restart() {
    setCycle((c) => c + 1)
    init()
  }

  if (loading) return <div className="loading">読み込み中...</div>

  if (!loading && deck.length === 0) {
    return (
      <div className="complete-screen">
        <div className="complete-icon">📭</div>
        <h2 className="complete-title">文がありません</h2>
        <p className="complete-sub">設定画面から例文を追加してください</p>
        <div className="complete-actions">
          <button className="btn-primary" onClick={onHome}>ホームへ</button>
        </div>
      </div>
    )
  }

  if (complete) {
    return (
      <div className="complete-screen">
        <div className="complete-icon">🗣️</div>
        <h2 className="complete-title">音読 完了！</h2>
        <p className="complete-sub">
          {cycle >= 2 ? `${cycle}周目まで音読しました。` : ''}型が体に馴染んできました。
          <br />このまま「デッキ周回」で瞬間英作文に挑戦しましょう。
        </p>
        <div className="complete-actions">
          <button className="btn-primary" onClick={onStartDeck}>② デッキ周回へ進む →</button>
          <button className="btn-ghost" onClick={restart}>↻ もう一周</button>
          <button className="btn-ghost" onClick={onHome}>ホームへ</button>
        </div>
      </div>
    )
  }

  const reached = repeat >= REPEAT_TARGET
  const progress = deck.length ? ((idx + 1) / deck.length) * 100 : 0

  return (
    <div className="session-screen">
      <div className="session-header">
        <button className="btn-back" onClick={onHome}>← ホーム</button>
        <span className="session-mode-label">① 音読{cycle >= 2 ? ` ・${cycle}周目` : ''}</span>
        <span className="ra-count">{idx + 1} / {deck.length}</span>
      </div>

      <div className="ra-progress">
        <div className="ra-progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="card-container">
        <div className="card-meta">
          <span className="tag-chip">{card.tag}</span>
          <span className="level-dots">{'●'.repeat(card.level)}{'○'.repeat(4 - card.level)}</span>
        </div>

        <div key={card.id} className="card-body card-enter ra-card">
          <div className="card-jp-section">
            <p className="jp-text">{card.jp}</p>
          </div>

          <div className="card-en-section">
            <div className="divider" />
            <p className="en-text">{card.en}</p>

            <div className={`repeat-row ${reached ? 'done' : ''}`}>
              <span className="repeat-label">
                {reached ? '✓ 音読 OK！' : '音声に続けて声に出す'}
              </span>
              <div className="repeat-dots">
                {[0, 1, 2].map((i) => (
                  <span key={i} className={`repeat-dot ${i < repeat ? 'on' : ''}`} />
                ))}
              </div>
              <button className="btn-repeat" onClick={doRepeat} aria-label="もう一度聞いて音読">
                🔊 リピート
              </button>
            </div>
          </div>
        </div>

        <button className={`btn-next ${reached ? 'ready' : ''}`} onClick={next}>
          {idx + 1 >= deck.length ? '仕上げる →' : '次へ →'}
        </button>
      </div>
    </div>
  )
}
