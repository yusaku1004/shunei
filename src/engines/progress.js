import { isDue } from './leitner'

// 文の集合から進捗サマリーを計算
// mastered: box5 / studying: 学習中(reps>0かつbox<5) / unseen: 未学習(reps=0) / due: 復習待ち
export function groupProgress(sentences = []) {
  let mastered = 0, studying = 0, unseen = 0, due = 0
  for (const s of sentences) {
    if (s.box === 5) mastered++
    else if ((s.reps || 0) > 0) studying++
    else unseen++
    if (isDue(s)) due++
  }
  const total = sentences.length
  const pct = total ? Math.round((mastered / total) * 100) : 0
  return { total, mastered, studying, unseen, due, pct }
}

// キー（level / tag など）ごとにグループ化して進捗を返す
export function progressByKey(sentences = [], keyFn) {
  const groups = new Map()
  for (const s of sentences) {
    const k = keyFn(s)
    if (!groups.has(k)) groups.set(k, [])
    groups.get(k).push(s)
  }
  const out = new Map()
  for (const [k, list] of groups) out.set(k, groupProgress(list))
  return out
}
