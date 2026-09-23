/**
 * Single shared date-formatting helper (Req 10). Every screen that
 * renders a listing date must call this instead of formatting inline, so
 * the format stays identical everywhere it appears — sprint 2's detail
 * page reuses this helper rather than reimplementing it.
 *
 * Chosen format: "Jan 5, 2026" — `Intl.DateTimeFormat` with
 * `dateStyle: 'medium'`, short and unambiguous for a prototype whose only
 * date inputs are ISO `YYYY-MM-DD` strings.
 */
const formatter = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'medium',
  timeZone: 'UTC',
})

export function formatDate(isoDate: string): string {
  // Parsed and formatted as UTC-midnight so a "YYYY-MM-DD" value never
  // shifts to the previous/next day depending on the viewer's local
  // timezone offset.
  const date = new Date(`${isoDate}T00:00:00Z`)
  return formatter.format(date)
}
