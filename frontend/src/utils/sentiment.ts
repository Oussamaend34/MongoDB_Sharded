import Sentiment from 'sentiment';

const sentiment = new Sentiment();

export function analyzeSentiment(text: string) {
  const result = sentiment.analyze(text);
  
  if (result.score > 0) return { score: result.score, label: 'Positive' };
  if (result.score < 0) return { score: result.score, label: 'Negative' };
  return { score: 0, label: 'Neutral' };
}

export function getSentimentColor(score: number) {
  if (score > 0) return 'text-green-600';
  if (score < 0) return 'text-red-600';
  return 'text-gray-600';
}