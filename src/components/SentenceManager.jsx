import { useState, useMemo } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, newSentenceRecord } from '../db/index'

const LEVELS = [1, 2, 3, 4]

export default function SentenceManager({ onBack }) {
  const sentences = useLiveQuery(() => db.sentences.orderBy('id').reverse().toArray(), [])

  const [filterTag, setFilterTag] = useState('all')
  const [search, setSearch] = useState('')

  // Add form
  const [showAdd, setShowAdd] = useState(false)
  const [draft, setDraft] = useState({ jp: '', en: '', tag: '', level: 1 })
  const [addError, setAddError] = useState('')

  // Inline edit / delete
  const [editingId, setEditingId] = useState(null)
  const [editDraft, setEditDraft] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  const tags = useMemo(
    () => [...new Set((sentences || []).map((s) => s.tag))].sort(),
    [sentences]
  )

  const filtered = useMemo(() => {
    let list = sentences || []
    if (filterTag !== 'all') list = list.filter((s) => s.tag === filterTag)
    const kw = search.trim().toLowerCase()
    if (kw) list = list.filter((s) => s.jp.toLowerCase().includes(kw) || s.en.toLowerCase().includes(kw))
    return list
  }, [sentences, filterTag, search])

  async function addSentence() {
    if (!draft.jp.trim() || !draft.en.trim()) {
      setAddError('日本語と英語の両方を入力してください')
      return
    }
    await db.sentences.add(newSentenceRecord(draft))
    setDraft((d) => ({ jp: '', en: '', tag: d.tag, level: d.level }))
    setAddError('')
  }

  function startEdit(s) {
    setDeletingId(null)
    setEditingId(s.id)
    setEditDraft({ jp: s.jp, en: s.en, tag: s.tag, level: s.level })
  }

  async function saveEdit(id) {
    if (!editDraft.jp.trim() || !editDraft.en.trim()) return
    await db.sentences.update(id, {
      jp: editDraft.jp.trim(),
      en: editDraft.en.trim(),
      tag: (editDraft.tag || 'カスタム').trim(),
      level: Number(editDraft.level) || 1,
    })
    setEditingId(null)
    setEditDraft(null)
  }

  async function remove(id) {
    await db.sentences.delete(id)
    setDeletingId(null)
  }

  return (
    <div className="settings-screen">
      <div className="settings-header">
        <button className="btn-back" onClick={onBack}>← 戻る</button>
        <h2>文を管理</h2>
      </div>

      {/* Add */}
      <section className="settings-section">
        <button className="manager-add-toggle" onClick={() => setShowAdd((v) => !v)}>
          {showAdd ? '✕ 閉じる' : '＋ 新しい文を追加'}
        </button>
        {showAdd && (
          <div className="manager-add-form">
            <div className="form-row">
              <label>日本語</label>
              <input
                className="input-text"
                value={draft.jp}
                onChange={(e) => setDraft({ ...draft, jp: e.target.value })}
                placeholder="例: 彼は毎朝走ります。"
              />
            </div>
            <div className="form-row">
              <label>英語</label>
              <input
                className="input-text"
                value={draft.en}
                onChange={(e) => setDraft({ ...draft, en: e.target.value })}
                placeholder="例: He runs every morning."
              />
            </div>
            <div className="manager-meta-row">
              <div className="form-row" style={{ flex: 1, marginBottom: 0 }}>
                <label>タグ</label>
                <input
                  className="input-text"
                  list="tag-list"
                  value={draft.tag}
                  onChange={(e) => setDraft({ ...draft, tag: e.target.value })}
                  placeholder="カスタム"
                />
                <datalist id="tag-list">
                  {tags.map((t) => <option key={t} value={t} />)}
                </datalist>
              </div>
              <div className="form-row" style={{ width: 110, marginBottom: 0 }}>
                <label>レベル</label>
                <select
                  className="input-select"
                  value={draft.level}
                  onChange={(e) => setDraft({ ...draft, level: Number(e.target.value) })}
                >
                  {LEVELS.map((l) => <option key={l} value={l}>レベル {l}</option>)}
                </select>
              </div>
            </div>
            {addError && <p className="gen-status" style={{ color: 'var(--again)' }}>{addError}</p>}
            <button className="btn-primary" style={{ marginTop: 12 }} onClick={addSentence}>
              追加する
            </button>
          </div>
        )}
      </section>

      {/* Filter */}
      <section className="settings-section">
        <input
          className="input-text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 日本語・英語で検索"
        />
        <div className="manager-tag-filter">
          <button
            className={`filter-chip ${filterTag === 'all' ? 'active' : ''}`}
            onClick={() => setFilterTag('all')}
          >
            すべて ({sentences?.length ?? 0})
          </button>
          {tags.map((t) => (
            <button
              key={t}
              className={`filter-chip ${filterTag === t ? 'active' : ''}`}
              onClick={() => setFilterTag(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </section>

      {/* List */}
      <section className="settings-section">
        <h3>{filtered.length}件の文</h3>
        <div className="manager-list">
          {filtered.map((s) =>
            editingId === s.id ? (
              <div key={s.id} className="manager-item editing">
                <div className="form-row">
                  <input
                    className="input-text"
                    value={editDraft.jp}
                    onChange={(e) => setEditDraft({ ...editDraft, jp: e.target.value })}
                  />
                </div>
                <div className="form-row">
                  <input
                    className="input-text"
                    value={editDraft.en}
                    onChange={(e) => setEditDraft({ ...editDraft, en: e.target.value })}
                  />
                </div>
                <div className="manager-meta-row">
                  <input
                    className="input-text"
                    list="tag-list"
                    style={{ flex: 1 }}
                    value={editDraft.tag}
                    onChange={(e) => setEditDraft({ ...editDraft, tag: e.target.value })}
                  />
                  <select
                    className="input-select"
                    style={{ width: 100 }}
                    value={editDraft.level}
                    onChange={(e) => setEditDraft({ ...editDraft, level: Number(e.target.value) })}
                  >
                    {LEVELS.map((l) => <option key={l} value={l}>Lv {l}</option>)}
                  </select>
                </div>
                <div className="manager-actions">
                  <button className="btn-small" onClick={() => { setEditingId(null); setEditDraft(null) }}>
                    キャンセル
                  </button>
                  <button className="btn-save" onClick={() => saveEdit(s.id)}>保存</button>
                </div>
              </div>
            ) : (
              <div key={s.id} className="manager-item">
                <div className="manager-item-text">
                  <p className="manager-jp">{s.jp}</p>
                  <p className="manager-en">{s.en}</p>
                  <div className="manager-item-meta">
                    <span className="tag-chip">{s.tag}</span>
                    <span className="level-dots">{'●'.repeat(s.level)}{'○'.repeat(4 - s.level)}</span>
                  </div>
                </div>
                {deletingId === s.id ? (
                  <div className="manager-actions">
                    <button className="btn-small" onClick={() => setDeletingId(null)}>戻る</button>
                    <button className="btn-danger" onClick={() => remove(s.id)}>削除</button>
                  </div>
                ) : (
                  <div className="manager-actions">
                    <button className="icon-btn" onClick={() => startEdit(s)} aria-label="編集">✏️</button>
                    <button className="icon-btn" onClick={() => { setEditingId(null); setDeletingId(s.id) }} aria-label="削除">🗑</button>
                  </div>
                )}
              </div>
            )
          )}
          {filtered.length === 0 && (
            <p className="manager-empty">該当する文がありません</p>
          )}
        </div>
      </section>
    </div>
  )
}
