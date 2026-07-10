import { useEffect, useState } from 'react'
import { getSetting, setSetting } from '../db/index'

export function useStreak() {
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    // 保存値をそのまま出すと、途切れた後も古い連続日数が表示され続ける。
    // 最終学習日が今日でも昨日でもなければ連続は途切れているので0扱い。
    async function load() {
      const current = await getSetting('streak', 0)
      const lastDate = await getSetting('last_study_date', null)
      const today = new Date().toDateString()
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const alive = lastDate === today || lastDate === yesterday.toDateString()
      setStreak(alive ? current : 0)
    }
    load()
  }, [])

  async function recordStudy() {
    const today = new Date().toDateString()
    const lastDate = await getSetting('last_study_date', null)
    if (lastDate === today) return

    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const current = await getSetting('streak', 0)
    const next = lastDate === yesterday.toDateString() ? current + 1 : 1

    await setSetting('streak', next)
    await setSetting('last_study_date', today)
    setStreak(next)
  }

  return { streak, recordStudy }
}
