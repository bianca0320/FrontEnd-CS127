/**
 * Format date to YYMMDD format
 * Example: new Date(2024, 0, 15) -> "240115"
 */
export function formatDateYYMMDD(date: Date): string {
  const year = date.getFullYear().toString().slice(-2)
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  return `${year}${month}${day}`
}

/**
 * Parse YYMMDD format string to Date
 * Example: "240115" -> Date(2024, 0, 15)
 */
export function parseYYMMDD(dateString: string): Date {
  const year = 2000 + parseInt(dateString.slice(0, 2), 10)
  const month = parseInt(dateString.slice(2, 4), 10) - 1
  const day = parseInt(dateString.slice(4, 6), 10)
  return new Date(year, month, day)
}

/**
 * Format date for display
 */
export function formatDateDisplay(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

