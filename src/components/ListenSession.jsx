import { useState, useEffect, useRef } from 'react'
import { db } from '../db/index'
import { buildDeck } from '../engines/deckCycle'
import { filterByStudyPrefs } from '../studyPrefs'
import { useStreak } from '../hooks/useStreak'
import { useTTS } from '../hooks/useTTS'

// 聞き流し（ハンズフリー）モード。
// 日本語を読み上げ → 頭の中で英作文する間 → 英語を読み上げ → 自動で次へ。
// 画面を見ずに通勤・家事中でも瞬間英作文の練習ができる。採点はしない。

function getTTSRate() {
  return Number(localStorage.getItem('shunei_ttsrate')) || 0.9
}

// 英文の長さに応じた「頭の中で英作文する」時間（ミリ秒）
function thinkTime(en) {
  const words = en.split(/\s+/).length
  return Math.min(8000, Math.max(3000, words * 600))
}

export default function ListenSession({ onHome }) {
  const [deck, setDeck] = useState([])
  const [idx, setIdx] = useState(0)
  const [cycle, setCycle] = useState(1)
  const [phase, setPhase] = useState('jp') // 'jp' | 'think' | 'en'
  const [playing, setPlaying] = useState(true)
  const [loading, setLoading] = useState(true)
  // 一時停止・カード切り替え後に古い読み上げコールバックが発火しないよう世代管理
  const genRef = useRef(0)
  const timerRef = useRef(null)
  const { recordStudy } = useStreak()
  const { speak, stop } = useTTS()

  useEffect(() => {
    recordStudy()
    init()
    return () => {
      genRef.current++
      clearTimeout(timerRef.current)
      stop()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function init() {
    const all = await db.sentences.toArray()
    const size = Number(localStorage.getItem('shunei_decksize')) || 7
    setDeck(buildDeck(filterByStudyPrefs(all), size))
    setLoading(false)
  }

  const card = deck[idx] ?? null

  // 再生の状態機械: 日本語 → 英作文タイム → 英語 → 少し置いて次のカード
  useEffect(() => {
    if (!card || !playing) return
    const gen = ++genRef.current
    const guard = (fn) => () => { if (genRef.current === gen) fn() }
    setPhase('jp')
    speak(card.jp, 'ja-JP', getTTSRate(), guard(() => {
      setPhase('think')
      timerRef.current = setTimeout(guard(() => {
        setPhase('en')
        speak(card.en, 'en-US', getTTSRate(), guard(() => {
          timerRef.current = setTimeout(guard(next), 1500)
        }))
      }), thinkTime(card.en))
    }))
    return () => clearTimeout(timerRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [card?.id, cycle, playing])

  // cancel()で発火しうる古いonendを無効化してから移動する
  function killPlayback() {
    genRef.current++
    clearTimeout(timerRef.current)
    stop()
  }

  function next() {
    killPlayback()
    setPhase('jp')
    if (idx + 1 >= deck.length) {
      setIdx(0)
      setCycle((c) => c + 1) // 周回でeffectを再発火させる（1枚デッキ対策も兼ねる）
    } else {
      setIdx((i) => i + 1)
    }
  }

  function prev() {
    if (deck.length < 2) return
    killPlayback()
    setPhase('jp')
    setIdx((i) => (i - 1 + deck.length) % deck.length)
  }

  function togglePlay() {
    if (playing) {
      killPlayback()
      setPlaying(false)
    } else {
      setPlaying(true) // 現在のカードの頭（日本語）から再開
    }
  }

  if (loading) return <div className="loading">読み込み中...</div>

  if (deck.length === 0) {
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

  const progress = deck.length ? ((idx + 1) / deck.length) * 100 : 0

  return (
    <div className="session-screen">
      <div className="session-header">
        <button className="btn-back" onClick={onHome}>← ホーム</button>
        <span className="session-mode-label">🎧 聞き流し{cycle >= 2 ? ` ・${cycle}周目` : ''}</span>
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

        <div key={`${card.id}-${cycle}`} className="card-body card-enter ra-card">
          <div className="card-jp-section">
            <p className="jp-text">{card.jp}</p>
          </div>

          <div className="card-en-section">
            <div className="divider" />
            {phase === 'en' ? (
              <p className="en-text">{card.en}</p>
            ) : (
              <p className="listen-think">
                {phase === 'think' ? '頭の中で英作文してみましょう…' : '…'}
              </p>
            )}
          </div>
        </div>

        <div className="listen-controls">
          <button className="listen-btn" onClick={prev} aria-label="前の文">⏮</button>
          <button className="listen-btn main" onClick={togglePlay}>
            {playing ? '⏸ 一時停止' : '▶ 再生'}
          </button>
          <button className="listen-btn" onClick={next} aria-label="次の文">⏭</button>
        </div>

        <p className="swipe-tip">
          日本語 →（英作文タイム）→ 英語 の順で自動再生。画面を見なくてもOKです
        </p>
      </div>
    </div>
  )
}
