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

export function applyTheme(pref = getThemePref()) {
  document.documentElement.dataset.theme = resolveTheme(pref)
}

export function setThemePref(pref) {
  localStorage.setItem(KEY, pref)
  applyTheme(pref)
}
