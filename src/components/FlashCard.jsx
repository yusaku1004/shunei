import { useState, useEffect, useRef } from 'react'
import { useTTS } from '../hooks/useTTS'
import { useTimer } from '../hooks/useTimer'
import { STAGE_NAMES, STAGE_INTERVALS } from '../engines/leitner'

const SPEED_THRESHOLD = 5
const SWIPE_THRESHOLD = 72

// デスクトップ（マウス/キーボード操作）かどうかを一度だけ判定
const IS_DESKTOP =
  typeof window !== 'undefined' &&
  window.matchMedia?.('(hover: hover) and (pointer: fine)').matches

function getAutoSpeak() {
  return localStorage.getItem('shunei_autospeak') !== 'off'
}
function getTTSRate() {
  return Number(localStorage.getItem('shunei_ttsrate')) || 0.9
}

function vibrate(ms) {
  try { navigator.vibrate?.(ms) } catch { /* noop */ }
}

export default function FlashCard({ sentence, onScore, combo = 0 }) {
  const [revealed, setRevealed] = useState(false)
  const [dragX, setDragX] = useState(0)
  const [exiting, setExiting] = useState(null)
  const startXRef = useRef(null)
  const firedRef = useRef(false)
  const { speak } = useTTS()
  const { elapsed, reset } = useTimer(!revealed)

  useEffect(() => {
    setRevealed(false)
    setDragX(0)
    setExiting(null)
    firedRef.current = false
    reset()
  }, [sentence?.id])

  function reveal() {
    if (revealed || exiting) return
    setRevealed(true)
    if (getAutoSpeak() && sentence) speak(sentence.en, 'en-US', getTTSRate())
  }

  function fireScore(score) {
    if (firedRef.current) return
    firedRef.current = true
    vibrate(score === 'good' ? 18 : 30)
    setExiting(score)
    setDragX(0)
    setTimeout(() => onScore(score), 320)
  }

  function replay() {
    if (sentence) speak(sentence.en, 'en-US', getTTSRate())
  }

  // Keyboard shortcuts (desktop)
  useEffect(() => {
    function onKey(e) {
      if (exiting || e.metaKey || e.ctrlKey || e.altKey) return
      const tag = e.target.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return

      if (!revealed) {
        if (e.code === 'Space' || e.code === 'Enter') {
          e.preventDefault()
          reveal()
        }
        return
      }
      switch (e.key) {
        case '1': case 'ArrowLeft':  e.preventDefault(); fireScore('again'); break
        case '2': case 'ArrowUp':    e.preventDefault(); fireScore('hard');  break
        case '3': case 'ArrowRight': e.preventDefault(); fireScore('good');  break
        case 'r': case 'R':          e.preventDefault(); replay();           break
        default: break
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [revealed, exiting, sentence?.id])

  if (!sentence) return null

  // Touch swipe handlers
  function onTouchStart(e) {
    if (!revealed) return
    startXRef.current = e.touches[0].clientX
  }
  function onTouchMove(e) {
    if (!revealed || startXRef.current === null) return
    setDragX(e.touches[0].clientX - startXRef.current)
  }
  function onTouchEnd() {
    if (!revealed || startXRef.current === null) return
    if (Math.abs(dragX) >= SWIPE_THRESHOLD) {
      fireScore(dragX > 0 ? 'good' : 'again')
    } else {
      setDragX(0)
    }
    startXRef.current = null
  }

  // Mouse drag handlers (desktop)
  function onMouseDown(e) {
    if (!revealed || e.target.closest('button')) return
    startXRef.current = e.clientX
  }
  function onMouseMove(e) {
    if (!revealed || startXRef.current === null || !(e.buttons & 1)) return
    setDragX(e.clientX - startXRef.current)
  }
  function onMouseUp() {
    if (!revealed || startXRef.current === null) return
    if (Math.abs(dragX) >= SWIPE_THRESHOLD) {
      fireScore(dragX > 0 ? 'good' : 'again')
    } else {
      setDragX(0)
    }
    startXRef.current = null
  }

  const isLive = revealed && !exiting
  const swipeProgress = Math.min(Math.abs(dragX) / SWIPE_THRESHOLD, 1)
  const showGoodHint = isLive && dragX > 15
  const showAgainHint = isLive && dragX < -15
  const isSpeedBonus = revealed && elapsed < SPEED_THRESHOLD

  const bodyStyle = isLive ? {
    transform: `translateX(${dragX}px) rotate(${dragX * 0.03}deg)`,
    transition: startXRef.current !== null ? 'none' : 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
  } : {}

  const exitClass = exiting === 'good' ? 'exit-right'
    : exiting === 'again' ? 'exit-left'
    : exiting === 'hard' ? 'exit-up'
    : ''

  const comboLevel = combo >= 10 ? 'combo-max' : combo >= 5 ? 'combo-high' : ''

  return (
    <div className="card-container">
      {/* Meta row */}
      <div className="card-meta">
        <span className="tag-chip">{sentence.tag}</span>
        <span className="level-dots">{'●'.repeat(sentence.level)}{'○'.repeat(4 - sentence.level)}</span>
        {combo >= 3 && (
          <span key={combo} className={`combo-badge ${comboLevel}`}>🔥 {combo}</span>
        )}
        <span className="box-badge" title={`次の復習: ${STAGE_INTERVALS[sentence.box]}`}>
          {STAGE_NAMES[sentence.box]}
        </span>
      </div>

      {/* Card body — swipeable after reveal */}
      <div
        key={sentence.id}
        className={`card-body card-enter ${exitClass}`}
        style={bodyStyle}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onClick={!revealed ? reveal : undefined}
      >
        {/* Swipe direction overlays */}
        {showGoodHint && (
          <div className="swipe-overlay good" style={{ opacity: swipeProgress * 0.9 }}>
            <span className="swipe-label">○</span>
          </div>
        )}
        {showAgainHint && (
          <div className="swipe-overlay again" style={{ opacity: swipeProgress * 0.9 }}>
            <span className="swipe-label">×</span>
          </div>
        )}

        {/* Japanese */}
        <div className="card-jp-section">
          <p className="jp-text">{sentence.jp}</p>
          {!revealed && (
            <p className="think-hint">
              {IS_DESKTOP ? 'クリック / スペースで答えを見る' : 'タップして答えを見る'}
            </p>
          )}
        </div>

        {/* Timer bar */}
        {!revealed && (
          <div className="timer-bar-wrap">
            <div className="timer-bar" style={{ width: `${Math.min((elapsed / SPEED_THRESHOLD) * 100, 100)}%` }} />
          </div>
        )}

        {/* English (revealed) */}
        {revealed && (
          <div className="card-en-section">
            <div className="divider" />
            {isSpeedBonus && <span className="speed-badge">⚡ 速い！</span>}
            <p className="en-text">{sentence.en}</p>
            <button
              className="btn-speak"
              onClick={(e) => { e.stopPropagation(); replay() }}
              aria-label="音声をもう一度再生"
              title={IS_DESKTOP ? 'もう一度再生 (R)' : 'もう一度再生'}
            >
              🔊
            </button>
          </div>
        )}
      </div>

      {/* Score buttons */}
      {revealed && (
        <>
          <p className="swipe-tip">
            {IS_DESKTOP ? '← NG / OK → ・ 1 2 3 キーでも採点' : '← スワイプで NG / OK →'}
          </p>
          <div className="score-buttons">
            <button className="score-btn again" onClick={() => fireScore('again')}>
              <span className="score-icon">×</span>
              <span className="score-label">NG</span>
            </button>
            <button className="score-btn hard" onClick={() => fireScore('hard')}>
              <span className="score-icon">△</span>
              <span className="score-label">惜しい</span>
            </button>
            <button className="score-btn good" onClick={() => fireScore('good')}>
              <span className="score-icon">○</span>
              <span className="score-label">OK!</span>
            </button>
          </div>
        </>
      )}
    </div>
  )
}
