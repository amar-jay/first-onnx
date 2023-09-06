import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function sigmoid<T>(t: T): T {
  const sig = 1/(1+Math.pow(Math.E, -t));
  return sig*100 as T;
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