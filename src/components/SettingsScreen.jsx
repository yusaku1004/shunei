import { useState, useRef } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, dateKey, exportBackup, validateBackup, importBackup } from '../db/index'
import { SAMPLE_SENTENCES } from '../data/sampleSentences'
import { useTTS } from '../hooks/useTTS'
import { getThemePref, setThemePref, applyTheme } from '../theme'

const TAGS = [...new Set(SAMPLE_SENTENCES.map((s) => s.tag))]
const LEVELS = [1, 2, 3, 4]

export default function SettingsScreen({ onBack, onManage }) {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('anthropic_key') || '')
  const [generating, setGenerating] = useState(false)
  const [genStatus, setGenStatus] = useState('')
  const [selectedTag, setSelectedTag] = useState(TAGS[0])
  const [selectedLevel, setSelectedLevel] = useState(2)
  const [genCount, setGenCount] = useState(10)
  const [resetConfirm, setResetConfirm] = useState(false)
  const [autoSpeak, setAutoSpeak] = useState(
    () => localStorage.getItem('shunei_autospeak') !== 'off'
  )
  const [ttsRate, setTtsRate] = useState(
    () => Number(localStorage.getItem('shunei_ttsrate')) || 0.9
  )
  const [theme, setTheme] = useState(getThemePref)
  const [repeatStep, setRepeatStep] = useState(
    () => localStorage.getItem('shunei_repeat') !== 'off'
  )
  const [deckSize, setDeckSize] = useState(
    () => Number(localStorage.getItem('shunei_decksize')) || 7
  )
  const [dailyGoal, setDailyGoal] = useState(
    () => Number(localStorage.getItem('shunei_dailygoal')) || 20
  )
  // インポート: 選択したファイルの内容と概要（確認画面用）
  const [importPending, setImportPending] = useState(null)
  const [backupStatus, setBackupStatus] = useState('')
  const fileInputRef = useRef(null)
  const { speak } = useTTS()

  function changeDeckSize(n) {
    setDeckSize(n)
    localStorage.setItem('shunei_decksize', String(n))
  }

  function changeDailyGoal(n) {
    setDailyGoal(n)
    localStorage.setItem('shunei_dailygoal', String(n))
  }

  function changeTheme(pref) {
    setTheme(pref)
    setThemePref(pref)
  }

  const sentences = useLiveQuery(() => db.sentences.toArray(), [])

  function toggleAutoSpeak() {
    const next = !autoSpeak
    setAutoSpeak(next)
    localStorage.setItem('shunei_autospeak', next ? 'on' : 'off')
  }

  function toggleRepeatStep() {
    const next = !repeatStep
    setRepeatStep(next)
    localStorage.setItem('shunei_repeat', next ? 'on' : 'off')
  }

  function changeRate(rate) {
    setTtsRate(rate)
    localStorage.setItem('shunei_ttsrate', String(rate))
    speak('This is a sample sentence.', 'en-US', rate)
  }

  function saveApiKey() {
    localStorage.setItem('anthropic_key', apiKey)
    setGenStatus('APIキーを保存しました')
    setTimeout(() => setGenStatus(''), 2000)
  }

  async function generateSentences() {
    const key = localStorage.getItem('anthropic_key')
    if (!key) {
      setGenStatus('APIキーを入力してください')
      return
    }
    setGenerating(true)
    setGenStatus('生成中...')
    try {
      const levelLabels = { 1: '入門', 2: '初級', 3: '中級', 4: '上級' }
      const prompt = `日本語→英語の瞬間英作文練習用の例文を${genCount}個生成してください。
条件:
- タグ: ${selectedTag}
- レベル: ${levelLabels[selectedLevel]}（TOEIC ${selectedLevel * 150 + 400}点程度）
- 自然な日本語と英語のペアで
- 短め〜中程度の文（英語で5〜15語）

必ず以下のJSON配列形式のみで出力してください（他のテキスト不要）:
[{"jp":"日本語文","en":"English sentence"},...]`

      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': key,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
          'anthropic-dangerous-direct-browser-calls': 'true',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 2000,
          messages: [{ role: 'user', content: prompt }],
        }),
      })

      if (!res.ok) throw new Error(`API error: ${res.status}`)
      const data = await res.json()
      const text = data.content[0].text
      const pairs = JSON.parse(text)

      const now = new Date().toISOString()
      await db.sentences.bulkAdd(
        pairs.map((p) => ({
          jp: p.jp,
          en: p.en,
          tag: selectedTag,
          level: selectedLevel,
          box: 1,
          ease: 2.5,
          interval: 1,
          next_due: now,
          reps: 0,
        }))
      )
      setGenStatus(`${pairs.length}文を追加しました！`)
    } catch (e) {
      setGenStatus(`エラー: ${e.message}`)
    } finally {
      setGenerating(false)
    }
  }

  async function downloadBackup() {
    const data = await exportBackup()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `shunei-backup-${dateKey()}.json`
    a.click()
    URL.revokeObjectURL(url)
    setBackupStatus(`${data.sentences.length}文をエクスポートしました`)
    setTimeout(() => setBackupStatus(''), 3000)
  }

  async function pickBackupFile(e) {
    const file = e.target.files?.[0]
    e.target.value = '' // 同じファイルを選び直せるようにリセット
    if (!file) return
    try {
      const data = JSON.parse(await file.text())
      const summary = validateBackup(data)
      setImportPending({ data, ...summary })
      setBackupStatus('')
    } catch (err) {
      setImportPending(null)
      setBackupStatus(`エラー: ${err.message}`)
    }
  }

  async function runImport() {
    try {
      await importBackup(importPending.data)
      // 復元した設定を画面とテーマに即時反映
      applyTheme()
      setTheme(getThemePref())
      setDeckSize(Number(localStorage.getItem('shunei_decksize')) || 7)
      setDailyGoal(Number(localStorage.getItem('shunei_dailygoal')) || 20)
      setAutoSpeak(localStorage.getItem('shunei_autospeak') !== 'off')
      setTtsRate(Number(localStorage.getItem('shunei_ttsrate')) || 0.9)
      setRepeatStep(localStorage.getItem('shunei_repeat') !== 'off')
      setBackupStatus(`${importPending.count}文を復元しました`)
      setTimeout(() => setBackupStatus(''), 3000)
    } catch (err) {
      setBackupStatus(`エラー: ${err.message}`)
    } finally {
      setImportPending(null)
    }
  }

  async function resetProgress() {
    const now = new Date().toISOString()
    await db.sentences.toCollection().modify({
      box: 1,
      ease: 2.5,
      interval: 1,
      next_due: now,
      reps: 0,
    })
    setResetConfirm(false)
    setGenStatus('進捗をリセットしました')
    setTimeout(() => setGenStatus(''), 2000)
  }

  async function deleteAllSentences() {
    await db.sentences.clear()
    setResetConfirm(false)
    setGenStatus('全文を削除しました')
    setTimeout(() => setGenStatus(''), 2000)
  }

  const tagCounts = {}
  sentences?.forEach((s) => {
    tagCounts[s.tag] = (tagCounts[s.tag] || 0) + 1
  })

  return (
    <div className="settings-screen">
      <div className="settings-header">
        <button className="btn-back" onClick={onBack}>← 戻る</button>
        <h2>設定・文の管理</h2>
      </div>

      {/* Stats */}
      <section className="settings-section">
        <h3>文の一覧</h3>
        <div className="tag-stats">
          {Object.entries(tagCounts).map(([tag, count]) => (
            <div key={tag} className="tag-stat-row">
              <span className="tag-chip">{tag}</span>
              <span className="tag-count">{count}文</span>
            </div>
          ))}
        </div>
        <button className="btn-primary" style={{ marginTop: 14 }} onClick={onManage}>
          ✏️ 文を追加・編集する
        </button>
      </section>

      {/* Appearance */}
      <section className="settings-section">
        <h3>表示</h3>
        <div className="setting-row">
          <div className="setting-label">
            <span className="setting-title">テーマ</span>
            <span className="setting-desc">ダークモードの切り替え</span>
          </div>
          <div className="speed-chips">
            {[
              { v: 'light', label: 'ライト' },
              { v: 'dark', label: 'ダーク' },
              { v: 'auto', label: '自動' },
            ].map(({ v, label }) => (
              <button
                key={v}
                className={`speed-chip ${theme === v ? 'active' : ''}`}
                onClick={() => changeTheme(v)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Study settings */}
      <section className="settings-section">
        <h3>学習設定</h3>
        <div className="setting-row">
          <div className="setting-label">
            <span className="setting-title">デッキの枚数</span>
            <span className="setting-desc">デッキ周回で1周に扱う文の数</span>
          </div>
          <div className="speed-chips">
            {[5, 7, 10, 15].map((n) => (
              <button
                key={n}
                className={`speed-chip ${deckSize === n ? 'active' : ''}`}
                onClick={() => changeDeckSize(n)}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <div className="setting-row">
          <div className="setting-label">
            <span className="setting-title">1日の目標</span>
            <span className="setting-desc">ホームの目標リングで使う採点数</span>
          </div>
          <div className="speed-chips">
            {[10, 20, 30, 50].map((n) => (
              <button
                key={n}
                className={`speed-chip ${dailyGoal === n ? 'active' : ''}`}
                onClick={() => changeDailyGoal(n)}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <div className="setting-row">
          <div className="setting-label">
            <span className="setting-title">答えの音声を自動再生</span>
            <span className="setting-desc">答えを表示したとき英語を読み上げます</span>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={autoSpeak}
            className={`toggle ${autoSpeak ? 'on' : ''}`}
            onClick={toggleAutoSpeak}
          >
            <span className="toggle-knob" />
          </button>
        </div>

        <div className="setting-row">
          <div className="setting-label">
            <span className="setting-title">リピート音読ステップ</span>
            <span className="setting-desc">答え表示後に「声に出して3回」を促します</span>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={repeatStep}
            className={`toggle ${repeatStep ? 'on' : ''}`}
            onClick={toggleRepeatStep}
          >
            <span className="toggle-knob" />
          </button>
        </div>

        <div className="setting-row">
          <div className="setting-label">
            <span className="setting-title">読み上げ速度</span>
            <span className="setting-desc">タップで試聴できます</span>
          </div>
          <div className="speed-chips">
            {[
              { v: 0.7, label: 'ゆっくり' },
              { v: 0.9, label: '標準' },
              { v: 1.1, label: '速い' },
            ].map(({ v, label }) => (
              <button
                key={v}
                className={`speed-chip ${Math.abs(ttsRate - v) < 0.01 ? 'active' : ''}`}
                onClick={() => changeRate(v)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Generate */}
      <section className="settings-section">
        <h3>AI で例文を生成</h3>
        <div className="form-row">
          <label>Anthropic API Key</label>
          <input
            type="password"
            className="input-text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-ant-..."
          />
          <button className="btn-small" onClick={saveApiKey}>保存</button>
        </div>

        <div className="form-row">
          <label>タグ</label>
          <select className="input-select" value={selectedTag} onChange={(e) => setSelectedTag(e.target.value)}>
            {TAGS.map((t) => <option key={t} value={t}>{t}</option>)}
            <option value="カスタム">カスタム</option>
          </select>
        </div>

        <div className="form-row">
          <label>レベル</label>
          <select className="input-select" value={selectedLevel} onChange={(e) => setSelectedLevel(Number(e.target.value))}>
            <option value={1}>1 入門</option>
            <option value={2}>2 初級</option>
            <option value={3}>3 中級</option>
            <option value={4}>4 上級</option>
          </select>
        </div>

        <div className="form-row">
          <label>生成数</label>
          <select className="input-select" value={genCount} onChange={(e) => setGenCount(Number(e.target.value))}>
            <option value={5}>5文</option>
            <option value={10}>10文</option>
            <option value={20}>20文</option>
          </select>
        </div>

        <button className="btn-primary" onClick={generateSentences} disabled={generating}>
          {generating ? '生成中...' : 'AIで生成する'}
        </button>

        {genStatus && <p className="gen-status">{genStatus}</p>}
      </section>

      {/* Backup */}
      <section className="settings-section">
        <h3>バックアップ</h3>
        <p className="setting-desc" style={{ marginBottom: 12 }}>
          文と学習の進捗をファイルに保存できます。機種変更やブラウザのデータ削除に備えて定期的にエクスポートしてください。
        </p>
        {!importPending ? (
          <div className="danger-buttons">
            <button className="btn-primary" style={{ flex: 1 }} onClick={downloadBackup}>
              ⬇ エクスポート
            </button>
            <button className="btn-ghost" style={{ flex: 1 }} onClick={() => fileInputRef.current?.click()}>
              ⬆ インポート
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              style={{ display: 'none' }}
              onChange={pickBackupFile}
            />
          </div>
        ) : (
          <div className="confirm-box">
            <p>
              {importPending.count}文のバックアップ
              {importPending.exportedAt &&
                `（${new Date(importPending.exportedAt).toLocaleDateString('ja-JP')}作成）`}
              を復元しますか？
              <br />現在の文と進捗はすべて上書きされます。
            </p>
            <div className="danger-buttons">
              <button className="btn-danger" onClick={runImport}>復元する</button>
              <button className="btn-ghost" onClick={() => setImportPending(null)}>キャンセル</button>
            </div>
          </div>
        )}
        {backupStatus && <p className="gen-status">{backupStatus}</p>}
      </section>

      {/* Danger zone */}
      <section className="settings-section danger-zone">
        <h3>データ管理</h3>
        {!resetConfirm ? (
          <div className="danger-buttons">
            <button className="btn-danger-ghost" onClick={() => setResetConfirm('progress')}>
              進捗リセット
            </button>
            <button className="btn-danger-ghost" onClick={() => setResetConfirm('all')}>
              全文を削除
            </button>
          </div>
        ) : (
          <div className="confirm-box">
            <p>{resetConfirm === 'progress' ? '全文の学習進捗をリセットしますか？' : '全文を削除しますか？（元に戻せません）'}</p>
            <div className="danger-buttons">
              <button
                className="btn-danger"
                onClick={resetConfirm === 'progress' ? resetProgress : deleteAllSentences}
              >
                実行する
              </button>
              <button className="btn-ghost" onClick={() => setResetConfirm(false)}>
                キャンセル
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
