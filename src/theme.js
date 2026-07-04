// テーマ管理: 'light' | 'dark' | 'auto'（OS設定に追従）
const KEY = 'shunei_theme'

export function getThemePref() {
  return localStorage.getItem(KEY) || 'auto'
}

export function resolveTheme(pref = getThemePref()) {
  if (pref === 'auto') {
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return pref
}

// ステータスバー/アドレスバーの色をテーマに合わせる（ライトとダークで背景色が違うため）
const THEME_COLORS = { light: '#f0efff', dark: '#14131f' }

function syncMetaThemeColor(resolved) {
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.setAttribute('content', THEME_COLORS[resolved])
}

export function applyTheme(pref = getThemePref()) {
  const resolved = resolveTheme(pref)
  document.documentElement.dataset.theme = resolved
  syncMetaThemeColor(resolved)
}

export function setThemePref(pref) {
  localStorage.setItem(KEY, pref)
  applyTheme(pref)
}

// 'auto' 選択中にOSのライト/ダーク切り替えが起きたら追従する
if (typeof window !== 'undefined' && window.matchMedia) {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (getThemePref() === 'auto') applyTheme('auto')
  })
}
