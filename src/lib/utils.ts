export function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}

export function resolveThemeColor(color?: string, accent?: string): string {
  const checkColor = (str?: string) => {
    if (!str) return null;
    const s = str.trim();
    if (s.startsWith('#') || s.startsWith('rgb') || s.startsWith('hsl')) {
      return s;
    }
    return null;
  };

  const directColor = checkColor(color);
  if (directColor) return directColor;
  
  const directAccent = checkColor(accent);
  if (directAccent) return directAccent;

  const text = `${color || ''} ${accent || ''}`.toLowerCase();
  if (text.includes('cyan')) return '#06b6d4';
  if (text.includes('violet') || text.includes('purple')) return '#8b5cf6';
  if (text.includes('emerald') || text.includes('teal') || text.includes('green')) return '#10b981';
  if (text.includes('amber') || text.includes('orange') || text.includes('yellow')) return '#f59e0b';
  if (text.includes('rose') || text.includes('red') || text.includes('pink')) return '#f43f5e';
  
  return '#9ca3af';
}
