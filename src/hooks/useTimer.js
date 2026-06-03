import { useEffect, useRef, useState } from 'react'

export function useTimer(running) {
  const [elapsed, setElapsed] = useState(0)
  const startRef = useRef(null)
  const rafRef = useRef(null)

  useEffect(() => {
    if (running) {
      // reset() を呼んでから running=true になるので常に 0 から開始
      startRef.current = Date.now()
      const tick = () => {
        setElapsed((Date.now() - startRef.current) / 1000)
        rafRef.current = requestAnimationFrame(tick)
      }
      rafRef.current = requestAnimationFrame(tick)
    } else {
      cancelAnimationFrame(rafRef.current)
    }
    return () => cancelAnimationFrame(rafRef.current)
  }, [running])

  const reset = () => setElapsed(0)

  return { elapsed, reset }
}
