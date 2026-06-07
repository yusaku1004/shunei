import { useState, useEffect, useRef } from 'react'
import { db, bumpDailyCount } from '../db/index'
import { gradeCard } from '../engines/leitner'
import { buildDeck, isDeckComplete } from '../engines/deckCycle'
import { getStudyTag } from '../studyPrefs'
import { useStreak } from '../hooks/useStreak'
import FlashCard from './FlashCard'
import DeckProgress from './DeckProgress'
import DeckComplete from './DeckComplete'

export default function DeckSession({ onHome }) {
  const [deck, setDeck] = useState([])
  const [results, setResults] = useState({})
  const [currentIdx, setCurrentIdx] = useState(0)
  const [complete, setComplete] = useState(false)
  const [loading, setLoading] = useState(true)
  const [combo, setCombo] = useState(0)
  const [maxCombo, setMaxCombo] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [scored, setScored] = useState(0)
  const [history, setHistory] = useState([])
  const sessionStart = useRef(Date.now())
  const { recordStudy } = useStreak()

  useEffect(() => {
    recordStudy()
    initDeck()
  }, [])

  async function initDeck() {
    setLoading(true)
    const all = await db.sentences.toArray()
    const tag = getStudyTag()
    const pool = tag ? all.filter((s) => s.tag === tag) : all
    const size = Number(localStorage.getItem('shunei_decksize')) || 7
    const d = buildDeck(pool, size)
    setDeck(d)
    setResults({})
    setCurrentIdx(0)
    setComplete(false)
    setCombo(0)
    setMaxCombo(0)
    setCorrect(0)
    setScored(0)
    setHistory([])
    sessionStart.current = Date.now()
    setLoading(false)
  }

  async function handleScore(score) {
    const card = deck[currentIdx]
    if (!card) return

    // Undo 用に直前の状態をスナップショット
    setHistory((h) => [...h, { card, currentIdx, results, combo, maxCombo, correct, scored }])

    const update = gradeCard(card, score)
    await db.sentences.update(card.id, update)
    bumpDailyCount(1)

    const newResults = { ...results, [card.id]: score }
    setResults(newResults)
    setScored((n) => n + 1)

    if (score === 'good') {
      const newCombo = combo + 1
      setCombo(newCombo)
      setCorrect((n) => n + 1)
      setMaxCombo((m) => Math.max(m, newCombo))
    } else {
      setCombo(0)
    }

    if (isDeckComplete(deck, newResults)) {
      setComplete(true)
      return
    }

    const remaining = deck.filter((s) => newResults[s.id] !== 'good')
    if (remaining.length === 0) { setComplete(true); return }

    const currentDeckPos = deck.findIndex((s) => s.id === card.id)
    const next =
      remaining.find((s) => deck.findIndex((d) => d.id === s.id) > currentDeckPos) ??
      remaining[0]
    setCurrentIdx(deck.findIndex((s) => s.id === next.id))
  }

  async function undo() {
    const snap = history[history.length - 1]
    if (!snap) return
    const { card } = snap
    // DB の採点結果を元に戻す
    await db.sentences.update(card.id, {
      box: card.box,
      next_due: card.next_due,
      reps: card.reps,
      ease: card.ease,
      interval: card.interval,
    })
    bumpDailyCount(-1)
    setResults(snap.results)
    setCurrentIdx(snap.currentIdx)
    setCombo(snap.combo)
    setMaxCombo(snap.maxCombo)
    setCorrect(snap.correct)
    setScored(snap.scored)
    setComplete(false)
    setHistory((h) => h.slice(0, -1))
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
    const duration = Math.round((Date.now() - sessionStart.current) / 1000)
    return (
      <DeckComplete
        deck={deck}
        stats={{ correct, total: scored, maxCombo, duration }}
        onRestart={initDeck}
        onHome={onHome}
      />
    )
  }

  return (
    <div className="session-screen">
      <div className="session-header">
        <button className="btn-back" onClick={onHome}>← ホーム</button>
        <span className="session-mode-label">デッキ周回</span>
        <button
          className="btn-undo"
          onClick={undo}
          disabled={history.length === 0}
        >
          ↩ 戻す
        </button>
      </div>
      <DeckProgress deck={deck} results={results} />
      <FlashCard sentence={deck[currentIdx] ?? null} onScore={handleScore} combo={combo} />
    </div>
  )
}
