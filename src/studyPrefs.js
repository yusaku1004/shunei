// 出題レベルの絞り込み設定（localStorage）
const KEY = 'shunei_levels'
export const ALL_LEVELS = [1, 2, 3, 4]

export function getStudyLevels() {
  try {
    const v = JSON.parse(localStorage.getItem(KEY))
    if (Array.isArray(v)) {
      const valid = v.filter((n) => ALL_LEVELS.includes(n))
      if (valid.length) return valid
    }
  } catch { /* ignore */ }
  return [...ALL_LEVELS]
}

export function setStudyLevels(levels) {
  const valid = levels.filter((n) => ALL_LEVELS.includes(n))
  localStorage.setItem(KEY, JSON.stringify(valid.length ? valid : ALL_LEVELS))
}
