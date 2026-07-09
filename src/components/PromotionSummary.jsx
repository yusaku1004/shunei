// セッション中の box の移動（{ [id]: { from, to } }）から
// 「ステージアップ」「習得済みに昇格」を集計して祝うバッジ行
export default function PromotionSummary({ boxMoves = {} }) {
  const moves = Object.values(boxMoves)
  const mastered = moves.filter((m) => m.to === 5 && m.from < 5).length
  const promoted = moves.filter((m) => m.to > m.from && m.to < 5).length
  if (mastered === 0 && promoted === 0) return null

  return (
    <div className="promo-summary">
      {mastered > 0 && (
        <span className="promo-badge mastered">🏆 {mastered}文が「習得済み」に！</span>
      )}
      {promoted > 0 && (
        <span className="promo-badge">📈 {promoted}文がステージアップ</span>
      )}
    </div>
  )
}
