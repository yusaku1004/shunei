import { useState, useEffect, useRef } from 'react'
import { db } from '../db/index'
import { gradeCard, getSRSDue } from '../engines/leitner'
import { useStreak } from '../hooks/useStreak'
import { STAGE_NAMES } from '../engines/leitner'
import FlashCard from './FlashCard'
import SRSComplete from './SRSComplete'

export default function SRSSession({ onHome }) {
  const [queue, setQueue] = useState([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [complete, setComplete] = useState(false)
  const [loading, setLoading] = useState(true)
  const [combo, setCombo] = useState(0)
  const [maxCombo, setMaxCombo] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [scored, setScored] = useState(0)
  const [boxUp, setBoxUp] = useState(null)
  const sessionStart = useRef(Date.now())
  const { recordStudy } = useStreak()

  useEffect(() => {
    recordStudy()
    initQueue()
  }, [])

  async function initQueue() {
    setLoading(true)
    const all = await db.sentences.toArray()
    const due = getSRSDue(all)
    const shuffled = [...due].sort(() => Math.random() - 0.5)
    setQueue(shuffled)
    setCurrentIdx(0)
    setCombo(0)
    setMaxCombo(0)
    setCorrect(0)
    setScored(0)
    sessionStart.current = Date.now()
    setComplete(shuffled.length === 0)
    setLoading(false)
  }

  async function handleScore(score) {
    const card = queue[currentIdx]
    if (!card) return

    const update = gradeCard(card, score)
    await db.sentences.update(card.id, update)
    if (update.box > card.box) {
      setBoxUp({ from: card.box, to: update.box })
      setTimeout(() => setBoxUp(null), 1800)
    }
    setScored((n) => n + 1)

    if (score === 'good') {
      const newCombo = combo + 1
      setCombo(newCombo)
      setCorrect((n) => n + 1)
      setMaxCombo((m) => Math.max(m, newCombo))
    } else {
      setCombo(0)
    }

    const nextIdx = currentIdx + 1
    if (nextIdx >= queue.length) {
      setComplete(true)
    } else {
      setCurrentIdx(nextIdx)
    }
  }

  if (loading) return <div className="loading">読み込み中...</div>

  if (complete) {
    const duration = Math.round((Date.now() - sessionStart.current) / 1000)
    return (
      <SRSComplete
        stats={{ correct, total: scored, maxCombo, duration }}
        onHome={onHome}
      />
    )
  }

  const remaining = queue.length - currentIdx

  return (
    <div className="session-screen">
      <div className="session-header">
        <button className="btn-back" onClick={onHome}>← ホーム</button>
        <span className="session-mode-label">SRS復習</span>
        <span className="remaining-badge">残り {remaining}</span>
      </div>
      {boxUp && (
        <div className={`boxup-toast ${boxUp.to === 5 ? 'boxup-master' : ''}`}>
          {boxUp.to === 5
            ? `🎉 習得済み！`
            : `📈 ${STAGE_NAMES[boxUp.from]} → ${STAGE_NAMES[boxUp.to]}`}
        </div>
      )}
      <FlashCard sentence={queue[currentIdx] ?? null} onScore={handleScore} combo={combo} />
    </div>
  )
}
