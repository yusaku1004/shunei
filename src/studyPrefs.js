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
