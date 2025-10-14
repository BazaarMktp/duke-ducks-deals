/**
 * Rounds a number down to the nearest 10 and adds a "+" suffix
 * @param num The number to format
 * @returns Formatted string (e.g., 102 -> "100+", 56 -> "50+", 5 -> "5+")
 */
export const formatUserCount = (num: number): string => {
  if (num < 10) {
    return `${num}+`;
  }
  const roundedDown = Math.floor(num / 10) * 10;
  return `${roundedDown}+`;
};
