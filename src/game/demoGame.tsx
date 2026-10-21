
import type { PlayingCardData } from '../components/PlayingCard'

type TrickPlay = {
  player: string
  card: PlayingCardData
}

const rankValues: Record<string, number> = {
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  '10': 10,
  J: 11,
  Q: 12,
  K: 13,
  A: 14,
}

export function getDemoTrickWinner(
  playerCard: PlayingCardData
): TrickPlay {
  const plays: TrickPlay[] = [
    {
      player: 'Theo',
      card: { rank: '4', suit: 'clubs' },
    },
    {
      player: 'Maya',
      card: { rank: 'K', suit: 'clubs' },
    },
    {
      player: 'You',
      card: playerCard,
    },
    {
      player: 'Sam',
      card: { rank: '2', suit: 'clubs' },
    },
  ]

  return plays.reduce((winner, play) =>
    rankValues[play.card.rank] > rankValues[winner.card.rank]
      ? play
      : winner
  )
}
