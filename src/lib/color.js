/* Parse a CSS hex color (`#rgb` or `#rrggbb`) into an `[r, g, b]` tuple, or null. */
export function hexToRgb(hexColor) {
  const normalized = hexColor?.trim().replace('#', '');
  if (!normalized) return null;

  const expanded =
    normalized.length === 3
      ? normalized
          .split('')
          .map((character) => `${character}${character}`)
          .join('')
      : normalized;

  if (!/^[\da-f]{6}$/i.test(expanded)) return null;

  const value = Number.parseInt(expanded, 16);
  if (!Number.isFinite(value)) return null;

  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}
