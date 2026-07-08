// Leitner Box SRS engine (5 boxes)
// Box intervals (in days): 1,2,4,8,16
const BOX_INTERVALS = [0, 1, 2, 4, 8, 16]

// ユーザー向けのステージ名と次回復習タイミング
// index = box番号 (0=未学習, 1〜5)
export const STAGE_NAMES    = ['未学習', '初回', '学習中', '定着中', 'もう少し', '習得済み']
export const STAGE_INTERVALS = ['—', '翌日', '2日後', '4日後', '8日後', '16日後']

export function getNextDue(box) {
  const days = BOX_INTERVALS[Math.min(box, 5)]
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString()
}

export function gradeCard(sentence, score) {
  // score: 'good' (○) | 'hard' (△) | 'again' (×)
  let { box } = sentence
  if (score === 'good') {
    box = Math.min(box + 1, 5)
  } else if (score === 'hard') {
    // stay in same box
  } else {
    box = 1
  }
  return {
    box,
    next_due: getNextDue(box),
    reps: (sentence.reps || 0) + 1,
  }
}

export function isDue(sentence) {
  // 一度も練習していないカードはSRS対象外（デッキ周回で先に出題する）
  if (!sentence.reps || sentence.reps === 0) return false
  const now = new Date()
  const due = new Date(sentence.next_due)
  return due <= now
}

export function getSRSDue(sentences) {
  return sentences.filter(isDue)
}

// 今後の復習予定を「今日から何日後か」ごとに集計する（期限到来分は除く）
// 戻り値: [{ days, count }] を日数の昇順で maxGroups 件まで
export function getUpcomingDue(sentences, maxGroups = 2) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const byDay = new Map()
  for (const s of sentences) {
    if (!s.reps) continue
    const due = new Date(s.next_due)
    due.setHours(0, 0, 0, 0)
    const days = Math.round((due - today) / 86400000)
    if (days <= 0) continue
    byDay.set(days, (byDay.get(days) || 0) + 1)
  }
  return [...byDay.entries()]
    .sort((a, b) => a[0] - b[0])
    .slice(0, maxGroups)
    .map(([days, count]) => ({ days, count }))
}

export function formatDueDays(days) {
  return days === 1 ? '明日' : `${days}日後`
}
