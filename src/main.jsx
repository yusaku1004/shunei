import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { applyTheme } from './theme'

// ちらつき防止のため、Reactマウント前にテーマを適用
applyTheme()

// TTS音声リストのウォームアップ。getVoices()は非同期ロードのため、
// 先に一度呼んでおかないと初回の読み上げで選択した音声が使われないことがある
window.speechSynthesis?.getVoices()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
