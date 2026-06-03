import { useEffect, useState } from 'react'
import { getSetting, setSetting } from '../db/index'

export function useStreak() {
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    getSetting('streak', 0).then(setStreak)
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
