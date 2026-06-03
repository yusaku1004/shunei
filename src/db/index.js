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
