// 学習の絞り込み設定（localStorage）
// レベル一覧（統計のレベル別表示などで使用）
export const ALL_LEVELS = [1, 2, 3, 4]

// 出題する文法（タグ）の絞り込み。null = すべて
const TAG_KEY = 'shunei_tag'
export function getStudyTag() {
  return localStorage.getItem(TAG_KEY) || null
}
export function setStudyTag(tag) {
  if (!tag || tag === 'all') localStorage.removeItem(TAG_KEY)
  else localStorage.setItem(TAG_KEY, tag)
}

// 出題するレベルの絞り込み。null = すべて
const LEVEL_KEY = 'shunei_level'
export function getStudyLevel() {
  const v = Number(localStorage.getItem(LEVEL_KEY))
  return ALL_LEVELS.includes(v) ? v : null
}
export function setStudyLevel(level) {
  if (!level) localStorage.removeItem(LEVEL_KEY)
  else localStorage.setItem(LEVEL_KEY, String(level))
}

// 現在の絞り込み（文法・レベル）を適用した学習対象の文を返す
export function filterByStudyPrefs(sentences) {
  const tag = getStudyTag()
  const level = getStudyLevel()
  return sentences.filter(
    (s) => (!tag || s.tag === tag) && (!level || s.level === level)
  )
}
