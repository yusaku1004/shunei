// Deck Cycle Mode engine
// Loops a fixed deck until every card is scored ○ in this session

export function buildDeck(sentences, maxSize = 10) {
  // Prioritize lower boxes, then shuffle
  const sorted = [...sentences].sort((a, b) => a.box - b.box)
  const deck = sorted.slice(0, maxSize)
  return shuffle(deck)
}

export function calcDeckProgress(results) {
  // results: { [id]: 'good'|'hard'|'again' }
  const ids = Object.keys(results)
  if (ids.length === 0) return 0
  const good = ids.filter((id) => results[id] === 'good').length
  return good / ids.length
}

export function isDeckComplete(deck, results) {
  return deck.every((s) => results[s.id] === 'good')
}

export function getNextCard(deck, results, currentIndex) {
  // Find next card that isn't 'good' yet
  const remaining = deck.filter((s) => results[s.id] !== 'good')
  if (remaining.length === 0) return null
  // Cycle through remaining in order
  const nextIdx = (currentIndex + 1) % remaining.length
  return remaining[nextIdx]
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
