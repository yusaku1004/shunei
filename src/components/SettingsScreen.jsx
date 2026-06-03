import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db/index'
import { SAMPLE_SENTENCES } from '../data/sampleSentences'

const TAGS = [...new Set(SAMPLE_SENTENCES.map((s) => s.tag))]
const LEVELS = [1, 2, 3, 4]

export default function SettingsScreen({ onBack }) {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('anthropic_key') || '')
  const [generating, setGenerating] = useState(false)
  const [genStatus, setGenStatus] = useState('')
  const [selectedTag, setSelectedTag] = useState(TAGS[0])
  const [selectedLevel, setSelectedLevel] = useState(2)
  const [genCount, setGenCount] = useState(10)
  const [resetConfirm, setResetConfirm] = useState(false)

  const sentences = useLiveQuery(() => db.sentences.toArray(), [])

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
