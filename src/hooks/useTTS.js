import { useCallback, useRef } from 'react'

export function useTTS() {
  const utterRef = useRef(null)

  const speak = useCallback((text, lang = 'en-US', rate = 0.9, onEnd) => {
    if (!window.speechSynthesis) {
      onEnd?.()
      return
    }
    window.speechSynthesis.cancel()
    const utter = new SpeechSynthesisUtterance(text)
    utter.lang = lang
    utter.rate = rate
    // 設定で選んだ音声は英語にのみ適用（voice は lang より優先されるため日本語には使わない）
    if (lang.startsWith('en')) {
      const uri = localStorage.getItem('shunei_voice')
      if (uri) {
        const voice = window.speechSynthesis.getVoices().find((v) => v.voiceURI === uri)
        if (voice) utter.voice = voice
      }
    }
    if (onEnd) utter.onend = onEnd
    utterRef.current = utter
    window.speechSynthesis.speak(utter)
  }, [])

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel()
  }, [])

  return { speak, stop }
}
