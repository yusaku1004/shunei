import { useState, useEffect, useRef } from 'react'
import { useTTS } from '../hooks/useTTS'
import { useTimer } from '../hooks/useTimer'
import { STAGE_NAMES, STAGE_INTERVALS } from '../engines/leitner'

const SPEED_THRESHOLD = 8
const SWIPE_THRESHOLD = 72
const TAP_MAX_MOVE = 8 // これ未満の移動は「スワイプの途中」ではなく「タップ」とみなす

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
function getRepeatEnabled() {
  return localStorage.getItem('shunei_repeat') !== 'off'
}

function vibrate(ms) {
  try { navigator.vibrate?.(ms) } catch { /* noop */ }
}

export default function FlashCard({ sentence, onScore, combo = 0 }) {
  const [revealed, setRevealed] = useState(false)
  const [dragX, setDragX] = useState(0)
  const [dragY, setDragY] = useState(0)
  const [exiting, setExiting] = useState(null)
  const [repeatCount, setRepeatCount] = useState(0)
  const [hintUsed, setHintUsed] = useState(false)
  const startXRef = useRef(null)
  const startYRef = useRef(null)
  const firedRef = useRef(false)
  const { speak, stop } = useTTS()
  const { elapsed, reset } = useTimer(!revealed)

  useEffect(() => {
    setRevealed(false)
    setDragX(0)
    setDragY(0)
    setExiting(null)
    setRepeatCount(0)
    setHintUsed(false)
    firedRef.current = false
    reset()
  }, [sentence?.id])

  function reveal() {
    if (revealed || exiting) return
    setRevealed(true)
    if (getAutoSpeak() && sentence) speak(sentence.en, 'en-US', getTTSRate())
  }

  function hide() {
    if (!revealed || exiting) return
    stop()
    setDragX(0)
    setDragY(0)
    setRevealed(false)
  }

  function fireScore(score) {
    if (firedRef.current) return
    firedRef.current = true
    vibrate(score === 'good' ? 18 : 30)
    setExiting(score)
    setDragX(0)
    setDragY(0)
    setTimeout(() => onScore(score), 320)
  }

  function replay() {
    if (sentence) speak(sentence.en, 'en-US', getTTSRate())
  }

  function doRepeat() {
    replay()
    setRepeatCount((c) => Math.min(c + 1, 3))
  }

  function showHint() {
    if (revealed || exiting) return
    setHintUsed(true)
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
        } else if (e.key === 'h' || e.key === 'H') {
          e.preventDefault()
          showHint()
        }
        return
      }
      switch (e.key) {
        case '1': case 'ArrowLeft':  e.preventDefault(); fireScore('again'); break
        case '2': case 'ArrowUp':    e.preventDefault(); fireScore('hard');  break
        case '3': case 'ArrowRight': e.preventDefault(); fireScore('good');  break
        case 'r': case 'R':          e.preventDefault(); replay();           break
        default:
          if (e.code === 'Space' || e.code === 'Enter') { e.preventDefault(); hide() }
          break
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [revealed, exiting, sentence?.id])

  if (!sentence) return null

  // スワイプ共通ロジック（横 = ○/×、上 = △）
  function beginDrag(x, y) {
    startXRef.current = x
    startYRef.current = y
  }
  function moveDrag(x, y) {
    setDragX(x - startXRef.current)
    setDragY(y - startYRef.current)
  }
  function endDrag() {
    const horizontal = Math.abs(dragX) >= Math.abs(dragY)
    if (horizontal && Math.abs(dragX) >= SWIPE_THRESHOLD) {
      fireScore(dragX > 0 ? 'good' : 'again')
    } else if (!horizontal && dragY <= -SWIPE_THRESHOLD) {
      fireScore('hard')
    } else if (Math.abs(dragX) < TAP_MAX_MOVE && Math.abs(dragY) < TAP_MAX_MOVE) {
      hide() // ほぼ動かずにタップ/クリック→リリース：答えを隠す
    } else {
      setDragX(0)
      setDragY(0)
    }
    startXRef.current = null
    startYRef.current = null
  }

  // Touch swipe handlers
  function onTouchStart(e) {
    if (!revealed || e.target.closest('button')) return
    beginDrag(e.touches[0].clientX, e.touches[0].clientY)
  }
  function onTouchMove(e) {
    if (!revealed || startXRef.current === null) return
    moveDrag(e.touches[0].clientX, e.touches[0].clientY)
  }
  function onTouchEnd() {
    if (!revealed || startXRef.current === null) return
    endDrag()
  }

  // Mouse drag handlers (desktop)
  function onMouseDown(e) {
    if (!revealed || e.target.closest('button')) return
    beginDrag(e.clientX, e.clientY)
  }
  function onMouseMove(e) {
    if (!revealed || startXRef.current === null || !(e.buttons & 1)) return
    moveDrag(e.clientX, e.clientY)
  }
  function onMouseUp() {
    if (!revealed || startXRef.current === null) return
    endDrag()
  }

  const isLive = revealed && !exiting
  const isHorizontal = Math.abs(dragX) >= Math.abs(dragY)
  const swipeProgress = Math.min(Math.abs(dragX) / SWIPE_THRESHOLD, 1)
  const hardProgress = Math.min(Math.abs(dragY) / SWIPE_THRESHOLD, 1)
  const showGoodHint = isLive && isHorizontal && dragX > 15
  const showAgainHint = isLive && isHorizontal && dragX < -15
  const showHardHint = isLive && !isHorizontal && dragY < -15
  const isSpeedBonus = revealed && elapsed < SPEED_THRESHOLD && !hintUsed
  // ヒント: 英文の最初の2語だけ見せる
  const hintText = sentence.en.split(/\s+/).slice(0, 2).join(' ')

  const lift = Math.min(dragY, 0) * 0.6 // 上方向のみ追従（下スワイプは無効）
  const bodyStyle = isLive ? {
    transform: `translate(${dragX}px, ${lift}px) rotate(${dragX * 0.03}deg)`,
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
        {showHardHint && (
          <div className="swipe-overlay hard" style={{ opacity: hardProgress * 0.9 }}>
            <span className="swipe-label">△</span>
          </div>
        )}

        {/* Japanese */}
        <div className="card-jp-section">
          <p className="jp-text">{sentence.jp}</p>
          {!revealed && hintUsed && (
            <p className="hint-text">💡 {hintText} …</p>
          )}
          {!revealed && (
            <p className="think-hint">
              {IS_DESKTOP ? 'クリック / スペースで答えを見る' : 'タップして答えを見る'}
            </p>
          )}
          {!revealed && !hintUsed && (
            <button
              className="btn-hint"
              onClick={(e) => { e.stopPropagation(); showHint() }}
              title={IS_DESKTOP ? '出だしの2語を見る (H)' : undefined}
            >
              💡 ヒント
            </button>
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
            {getRepeatEnabled() ? (
              <div
                className={`repeat-row ${repeatCount >= 3 ? 'done' : ''}`}
                onClick={(e) => e.stopPropagation()}
              >
                <span className="repeat-label">
                  {repeatCount >= 3 ? '✓ リピート完了！' : '声に出して3回リピート'}
                </span>
                <div className="repeat-dots">
                  {[0, 1, 2].map((i) => (
                    <span key={i} className={`repeat-dot ${i < repeatCount ? 'on' : ''}`} />
                  ))}
                </div>
                <button
                  className="btn-repeat"
                  onClick={(e) => { e.stopPropagation(); doRepeat() }}
                  aria-label="リピート再生"
                >
                  🔊 リピート
                </button>
              </div>
            ) : (
              <button
                className="btn-speak"
                onClick={(e) => { e.stopPropagation(); replay() }}
                aria-label="音声をもう一度再生"
                title={IS_DESKTOP ? 'もう一度再生 (R)' : 'もう一度再生'}
              >
                🔊
              </button>
            )}
          </div>
        )}
      </div>

      {/* Score buttons */}
      {revealed && (
        <>
          <p className="swipe-tip">
            {IS_DESKTOP
              ? '← NG / OK → ・ ↑ 惜しい ・ 1 2 3 キーでも採点 ・ タップ / Space で隠す'
              : '← NG / OK → ・ ↑ 惜しい ・ タップで隠す'}
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
