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

const SEED_VERSION = 7

function toDBRecord(s) {
  return { ...s, box: 1, ease: 2.5, interval: 1, next_due: new Date().toISOString(), reps: 0 }
}

// 英文の修正履歴（既存DB向け）。
// 各 from（過去のどのバージョンの英文か）を最新英文(to)へ直接マッピングするので、
// どの版から始めても1回のパスで最新に到達する。
// 現在の英文（=最新）に一致しない文＝ユーザーが手動編集した文は上書きしない。
const EN_CORRECTIONS = [
  // 自然化（v4）＋平易化（v5）で複数回変えた文は、全ての旧英文を最新へ向ける
  { jp: '彼女はその時、涙をこらえられませんでした。', from: 'She could not hold back her tears at that time.', to: 'She could not stop her tears at that moment.' },
  { jp: '彼女はその時、涙をこらえられませんでした。', from: 'She could not hold back her tears at that moment.', to: 'She could not stop her tears at that moment.' },
  { jp: '新しいシステムは来週から使えるようになります。', from: 'The new system will be available from next week.', to: 'You will be able to use the new system next week.' },
  { jp: '新しいシステムは来週から使えるようになります。', from: 'The new system will be available starting next week.', to: 'You will be able to use the new system next week.' },
  { jp: '最近、疲れが取れません。', from: 'I have not been able to shake off my fatigue lately.', to: "I just can't seem to shake off my tiredness lately." },
  { jp: '最近、疲れが取れません。', from: 'I cannot seem to shake off my tiredness lately.', to: "I just can't seem to shake off my tiredness lately." },
  { jp: '最近、疲れが取れません。', from: 'I cannot get rid of my tiredness lately.', to: "I just can't seem to shake off my tiredness lately." },
  // 自然化のみ（v4）
  { jp: '来週から新しい習慣を始めるつもりです。', from: 'I am going to start a new habit from next week.', to: 'I am going to start a new habit next week.' },
  { jp: '何かあれば遠慮なく言ってください。', from: 'Please feel free to say anything if there is a problem.', to: 'Please feel free to let me know if you need anything.' },
  { jp: '会議は突然キャンセルされました。', from: 'The meeting was suddenly cancelled.', to: 'The meeting was suddenly canceled.' },
  { jp: '先ほどのご説明について確認させてください。', from: 'Let me clarify what you explained earlier.', to: 'Let me make sure I understood what you explained earlier.' },
  { jp: 'この辺でおすすめのレストランはありますか？', from: 'Is there any restaurant you recommend around here?', to: 'Is there a restaurant you would recommend around here?' },
  { jp: '定期的に健康診断を受けることをお勧めします。', from: 'I recommend getting a regular health checkup.', to: 'I recommend getting regular health checkups.' },
  { jp: '再生可能エネルギーへの移行が求められています。', from: 'A shift to renewable energy is required.', to: 'A shift to renewable energy is needed.' },
  // 平易化のみ（v5）
  { jp: 'この問題はとても難しいです。', from: 'This problem is very difficult.', to: 'This problem is very hard.' },
  { jp: '私たちはまだ結論に達していません。', from: 'We have not reached a conclusion yet.', to: 'We have not made a decision yet.' },
  { jp: 'これは私が今まで食べた中で一番おいしい料理です。', from: 'This is the most delicious food I have ever eaten.', to: 'This is the best food I have ever eaten.' },
  { jp: 'この方法はあの方法ほど効果的ではありません。', from: 'This method is not as effective as that one.', to: 'This method does not work as well as that one.' },
  { jp: '私は電車よりバスのほうが好きです。', from: 'I prefer buses to trains.', to: 'I like buses better than trains.' },
  { jp: '新しい言語を学ぶことは挑戦的ですが楽しいです。', from: 'Learning a new language is challenging but fun.', to: 'Learning a new language is hard but fun.' },
  { jp: 'このレポートは明日までに提出しなければなりません。', from: 'This report must be submitted by tomorrow.', to: 'This report must be handed in by tomorrow.' },
  { jp: '彼は先週、社長に任命されました。', from: 'He was appointed president last week.', to: 'He was made president last week.' },
  { jp: '彼女が作った料理はとてもおいしかったです。', from: 'The food that she made was very delicious.', to: 'The food that she made was really good.' },
  { jp: '会議の日程を確認させてください。', from: 'Let me confirm the meeting schedule.', to: 'Let me check the meeting schedule.' },
  { jp: '詳細については追ってご連絡いたします。', from: 'I will follow up with the details later.', to: 'I will send you the details later.' },
  { jp: 'この件についてご相談したいのですが。', from: 'I would like to discuss this matter with you.', to: 'I would like to talk about this with you.' },
  { jp: 'この見積もりをご確認いただけますか？', from: 'Could you review this estimate?', to: 'Could you check this estimate?' },
  { jp: '環境問題は私たち全員に関係しています。', from: 'Environmental issues concern all of us.', to: 'Environmental problems affect all of us.' },
  { jp: 'プラスチックゴミを減らすことが重要です。', from: 'It is important to reduce plastic waste.', to: 'It is important to use less plastic.' },
  { jp: 'この状況に少しイライラしています。', from: 'I am a little frustrated with this situation.', to: 'I am a little annoyed with this situation.' },
  // 自然化（v7）
  { jp: '私は毎晩日記をつけています。', from: 'I keep a diary every night.', to: 'I write in my diary every night.' },
  { jp: '彼女は映画を見に映画館へ行きました。', from: 'She went to the movie theater to watch a movie.', to: 'She went to the movie theater to see a movie.' },
  { jp: 'もしお金があれば、新しい車を買うのに。', from: 'If I had money, I would buy a new car.', to: 'If I had the money, I would buy a new car.' },
  { jp: 'ご多忙のところ恐れ入りますが。', from: 'I am sorry to bother you when you are busy.', to: 'I am sorry to bother you while you are busy.' },
  { jp: '帰りの航空券を予約したいです。', from: 'I would like to book a return flight.', to: 'I would like to book my return flight.' },
  { jp: '天気予報によると、今日は良くなるそうです。', from: 'According to the weather forecast, it will improve today.', to: 'According to the weather forecast, it will clear up today.' },
  { jp: '傘を持って行った方がいいですよ。', from: "You'd better bring an umbrella.", to: "You'd better take an umbrella." },
  { jp: 'この用紙に記入しなければなりませんか？', from: 'Do I have to fill out the form?', to: 'Do I have to fill out this form?' },
  { jp: 'この数字をもう一度確認していただけますか？', from: 'Could you double check these figures for me?', to: 'Could you double-check these figures for me?' },
  // v5でproposal→ideaに平易化したが、提案の訳としてはproposalが正確で
  // 他の文でも使っている語のため、v7でproposalに戻す（逆方向のみ残す）
  { jp: '正直、その提案には賛成できません。', from: 'Honestly, I cannot agree with that idea.', to: 'Honestly, I cannot agree with that proposal.' },
]

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

  // 英文の自然化修正を反映（旧英文のままの文だけ）
  const fixMap = new Map(EN_CORRECTIONS.map((c) => [c.jp + ' ' + c.from, c.to]))
  await db.sentences.toCollection().modify((s) => {
    const to = fixMap.get(s.jp + ' ' + s.en)
    if (to) s.en = to
  })

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

// ============================
// バックアップ / 復元
// ============================
// 端末のブラウザデータ削除や機種変更で学習履歴が消えないよう、
// 文・進捗・設定を1つのJSONに書き出し/読み込みする。
// APIキーは秘匿情報なので含めない。
const BACKUP_PREF_KEYS = [
  'shunei_tag',
  'shunei_level',
  'shunei_decksize',
  'shunei_dailygoal',
  'shunei_autospeak',
  'shunei_ttsrate',
  'shunei_repeat',
  'shunei_theme',
  'shunei_voice',
]

export async function exportBackup() {
  const prefs = {}
  for (const k of BACKUP_PREF_KEYS) {
    const v = localStorage.getItem(k)
    if (v !== null) prefs[k] = v
  }
  return {
    app: 'shunei',
    backupVersion: 1,
    exportedAt: new Date().toISOString(),
    sentences: await db.sentences.toArray(),
    settings: await db.settings.toArray(),
    prefs,
  }
}

// バックアップの中身を検証し、概要を返す（インポート前の確認用）
export function validateBackup(data) {
  if (!data || data.app !== 'shunei' || !Array.isArray(data.sentences)) {
    throw new Error('瞬英のバックアップファイルではありません')
  }
  if (data.sentences.some((s) => !s.jp || !s.en)) {
    throw new Error('バックアップの文データが壊れています')
  }
  return { count: data.sentences.length, exportedAt: data.exportedAt }
}

// 現在のデータをバックアップの内容で置き換える
export async function importBackup(data) {
  validateBackup(data)
  await db.transaction('rw', db.sentences, db.settings, async () => {
    await db.sentences.clear()
    await db.sentences.bulkAdd(data.sentences)
    if (Array.isArray(data.settings)) {
      await db.settings.bulkPut(data.settings)
    }
  })
  for (const k of BACKUP_PREF_KEYS) {
    const v = data.prefs?.[k]
    if (v !== undefined) localStorage.setItem(k, v)
  }
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
