export function sigmoid(t: bigint | number) {
  const sig = 1/(1+Math.pow(Math.E, -new Number(t)));
  return sig*100 as any;
}

export const EMOTIONS = [
  'admiration 👏',
  'amusement 😂',
  'anger 😡',
  'annoyance 😒',
  'approval 👍',
  'caring 🤗',
  'confusion 😕',
  'curiosity 🤔',
  'desire 😍',
  'disappointment 😞',
  'disapproval 👎',
  'disgust 🤮',
  'embarrassment 😳',
  'excitement 🤩',
  'fear 😨',
  'gratitude 🙏',
  'grief 😢',
  'joy 😃',
  'love ❤️',
  'nervousness 😬',
  'optimism 🤞',
  'pride 😌',
  'realization 💡',
  'relief😅',
  'remorse 😞', 
  'sadness 😞',
  'surprise 😲',
  'neutral 😐'
];