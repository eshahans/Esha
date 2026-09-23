import { describe, expect, it } from 'vitest'
import { formatDate } from './formatDate'

describe('formatDate', () => {
  it('formats an ISO date into the shared human-readable format', () => {
    expect(formatDate('2026-01-05')).toBe('Jan 5, 2026')
  })

  it('does not shift the date at year/month boundaries', () => {
    expect(formatDate('2026-12-31')).toBe('Dec 31, 2026')
    expect(formatDate('2026-01-01')).toBe('Jan 1, 2026')
  })
})
