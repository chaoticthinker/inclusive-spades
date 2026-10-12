
export type Suit = 'clubs' | 'diamonds' | 'hearts' | 'spades'

export type PlayingCardData = {
  rank: string
  suit: Suit
}

type PlayingCardProps = {
  card: PlayingCardData
  playable: boolean
  onSelect: (card: PlayingCardData) => void
}

const suitSymbols: Record<Suit, string> = {
  clubs: '♣',
  diamonds: '♦',
  hearts: '♥',
  spades: '♠',
}

const rankNames: Record<string, string> = {
  A: 'Ace',
  K: 'King',
  Q: 'Queen',
  J: 'Jack',
}

export function getCardName(card: PlayingCardData): string {
  const rank = rankNames[card.rank] ?? card.rank

  return `${rank} of ${card.suit}`
}

export function PlayingCard({
  card,
  playable,
  onSelect,
}: PlayingCardProps) {
  return (
    <button
      type="button"
      className="playing-card"
      disabled={!playable}
      onClick={() => onSelect(card)}
      aria-label={`${getCardName(card)}, ${
        playable ? 'playable' : 'not playable'
      }`}
    >
      <span className="playing-card-face" aria-hidden="true">
        {card.rank} {suitSymbols[card.suit]}
      </span>

      <span className="playing-card-status" aria-hidden="true">
        {playable ? 'PLAYABLE' : 'NOT PLAYABLE'}
      </span>
    </button>
  )
}
