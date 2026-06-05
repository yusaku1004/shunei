import Dexie from 'dexie'

export const db = new Dexie('ShuneiDB')

db.version(1).stores({
  sentences: '++id, tag, level, box, next_due',
  settings: 'key',
  sessions: '++id, mode, createdAt',
})

// v2: reps フィールドを明示的に保持（既存データは reps が undefined になっている可能性があるため初期化）
db.version(2).stores({
  sentences: '++id, tag, level, box, next_due, reps',
  settings: 'key',
  sessions: '++id, mode, createdAt',
}).upgrade((tx) => {
  return tx.table('sentences').toCollection().modify((s) => {
    if (s.reps === undefined) s.reps = 0
  })
})

const SEED_VERSION = 3

function toDBRecord(s) {
  return { ...s, box: 1, ease: 2.5, interval: 1, next_due: new Date().toISOString(), reps: 0 }
}

// React StrictMode でエフェクトが2回走っても重複シードしないようにキャッシュ
let _seedPromise = null

export function seedIfEmpty() {
  if (!_seedPromise) _seedPromise = _doSeed()
  return _seedPromise
}

async function _doSeed() {
  const { SAMPLE_SENTENCES } = await import('../data/sampleSentences.js')
  const count = await db.sentences.count()

  if (count === 0) {
    await db.sentences.bulkAdd(SAMPLE_SENTENCES.map(toDBRecord))
    await setSetting('seed_version', SEED_VERSION)
    return
  }

  // 既存DBへの差分追加（バージョンが古ければ新文だけ追加）
  const storedVersion = await getSetting('seed_version', 1)
  if (storedVersion >= SEED_VERSION) return

  const existing = await db.sentences.toArray()
  const existingJP = new Set(existing.map((s) => s.jp))
  const toAdd = SAMPLE_SENTENCES.filter((s) => !existingJP.has(s.jp))
  if (toAdd.length > 0) {
    await db.sentences.bulkAdd(toAdd.map(toDBRecord))
  }
  await setSetting('seed_version', SEED_VERSION)
}

export async function getSetting(key, defaultVal = null) {
  const row = await db.settings.get(key)
  return row ? row.value : defaultVal
}

export async function setSetting(key, value) {
  await db.settings.put({ key, value })
}

export function dateKey(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function todayKey() {
  return dateKey()
}

// 日次の採点数を記録（統計ヒートマップ用）。undo 時は delta=-1 で減算。
export async function bumpDailyCount(delta = 1) {
  const counts = await getSetting('daily_counts', {})
  const k = todayKey()
  counts[k] = Math.max(0, (counts[k] || 0) + delta)
  await setSetting('daily_counts', counts)
}

export async function getDailyCounts() {
  return getSetting('daily_counts', {})
}

// 手動追加した文に学習用フィールドを付与
export function newSentenceRecord({ jp, en, tag, level }) {
  return {
    jp: jp.trim(),
    en: en.trim(),
    tag: (tag || 'カスタム').trim(),
    level: Number(level) || 1,
    box: 1,
    ease: 2.5,
    interval: 1,
    next_due: new Date().toISOString(),
    reps: 0,
  }
}
