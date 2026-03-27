/**
 * Rounds a number to a specified number of decimal places (defaults to two decimals);
 * @param num - The number to round
 * @param decimals - The number of decimal placed to round to (defaults to 2)
 * @return - The rounded number
 */

export const roundTo = (num: number, decimals: number = 2): number => {
  return Number(num.toFixed(decimals));
}