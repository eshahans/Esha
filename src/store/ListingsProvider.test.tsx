import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ListingsProvider } from './ListingsProvider'
import { useListings } from './useListings'

const sampleInput = {
  title: 'Cozy Loft',
  neighbourhood: 'Fremont',
  price: '$1,200/month',
  availableFrom: '2026-01-01',
  availableUntil: '2026-02-01',
  tipFood: '',
  tipActivity: '',
  tipNeighbourhood: '',
}

function Harness() {
  const { listings, addListing } = useListings()
  return (
    <div>
      <button onClick={() => addListing(sampleInput)}>add</button>
      <ul>
        {listings.map((listing) => (
          <li key={listing.id}>
            {listing.title} ({listing.id})
          </li>
        ))}
      </ul>
    </div>
  )
}

describe('ListingsProvider', () => {
  it('adds a listing with a generated id and exposes it via useListings', async () => {
    const user = userEvent.setup()
    render(
      <ListingsProvider>
        <Harness />
      </ListingsProvider>,
    )

    await user.click(screen.getByText('add'))

    expect(screen.getByText(/Cozy Loft/)).toBeInTheDocument()
  })

  it('generates a unique id per listing, never derived from array position', async () => {
    const user = userEvent.setup()
    render(
      <ListingsProvider>
        <Harness />
      </ListingsProvider>,
    )

    await user.click(screen.getByText('add'))
    await user.click(screen.getByText('add'))

    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(2)
    const ids = items.map((item) => item.textContent)
    expect(new Set(ids).size).toBe(2)
  })

  it('throws when useListings is used outside a ListingsProvider', () => {
    function Bare() {
      useListings()
      return null
    }
    // React logs the thrown error to console.error too; keep test output clean.
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<Bare />)).toThrow(
      'useListings must be used within a ListingsProvider',
    )
    spy.mockRestore()
  })
})
