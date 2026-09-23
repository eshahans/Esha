import { fireEvent, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '../test/renderApp'

async function postASampleListing(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('Listing Title'), 'Cozy Loft')
  await user.type(screen.getByLabelText('Neighbourhood'), 'Fremont')
  await user.type(screen.getByLabelText('Price'), '$1,200/month')
  fireEvent.change(screen.getByLabelText('Available From'), {
    target: { value: '2026-01-01' },
  })
  fireEvent.change(screen.getByLabelText('Available Until'), {
    target: { value: '2026-02-01' },
  })
  await user.click(screen.getByRole('button', { name: 'Post Listing' }))
}

describe('ListingsPage', () => {
  it('shows an empty state with a link to the create screen when there are no listings', () => {
    renderApp('/listings')

    expect(screen.getByText('No listings yet.')).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'Create the first listing' }),
    ).toBeInTheDocument()
  })

  it('renders exactly title, neighbourhood, price and dates per row, as a clickable link', async () => {
    const user = userEvent.setup()
    renderApp('/create')
    await postASampleListing(user)

    const row = await screen.findByRole('link', { name: /Cozy Loft/ })
    expect(row).toHaveAttribute('href', expect.stringMatching(/^\/listings\/.+/))
    expect(within(row).getByText('Fremont')).toBeInTheDocument()
    expect(within(row).getByText('$1,200/month')).toBeInTheDocument()
    expect(within(row).getByText('Jan 1, 2026 – Feb 1, 2026')).toBeInTheDocument()
  })

  it('navigates to a real route (not a 404) when a listing row is activated', async () => {
    const user = userEvent.setup()
    renderApp('/create')
    await postASampleListing(user)

    const row = await screen.findByRole('link', { name: /Cozy Loft/ })
    await user.click(row)

    expect(await screen.findByText(/coming in a future sprint/i)).toBeInTheDocument()
  })
})
