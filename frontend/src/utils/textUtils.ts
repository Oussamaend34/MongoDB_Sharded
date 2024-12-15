export function truncateText(text: string, wordLimit: number = 100): string {
  if (!text) return '';
  
  const words = text.split(/\s+/);
  if (words.length <= wordLimit) return text;
  
  return words.slice(0, wordLimit).join(' ') + '...';
}
