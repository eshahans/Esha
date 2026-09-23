import { fireEvent, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '../test/renderApp'

async function fillRequiredFields(
  user: ReturnType<typeof userEvent.setup>,
  overrides: Partial<{
    title: string
    neighbourhood: string
    price: string
    availableFrom: string
    availableUntil: string
  }> = {},
) {
  const values = {
    title: 'Cozy Loft',
    neighbourhood: 'Fremont',
    price: '$1,200/month',
    availableFrom: '2026-01-01',
    availableUntil: '2026-02-01',
    ...overrides,
  }

  if (values.title) await user.type(screen.getByLabelText('Listing Title'), values.title)
  if (values.neighbourhood) {
    await user.type(screen.getByLabelText('Neighbourhood'), values.neighbourhood)
  }
  if (values.price) await user.type(screen.getByLabelText('Price'), values.price)
  if (values.availableFrom) {
    fireEvent.change(screen.getByLabelText('Available From'), {
      target: { value: values.availableFrom },
    })
  }
  if (values.availableUntil) {
    fireEvent.change(screen.getByLabelText('Available Until'), {
      target: { value: values.availableUntil },
    })
  }
}

describe('CreateListingPage', () => {
  it('renders all eight fields with the tips carrying their category labels', () => {
    renderApp('/create')

    expect(screen.getByLabelText('Listing Title')).toBeInTheDocument()
    expect(screen.getByLabelText('Neighbourhood')).toBeInTheDocument()
    expect(screen.getByLabelText('Price')).toBeInTheDocument()
    expect(screen.getByLabelText('Available From')).toHaveAttribute('type', 'date')
    expect(screen.getByLabelText('Available Until')).toHaveAttribute('type', 'date')
    expect(screen.getByLabelText('Local tip: food/coffee')).toBeInTheDocument()
    expect(screen.getByLabelText('Local tip: activity/place')).toBeInTheDocument()
    expect(screen.getByLabelText('Local tip: neighbourhood')).toBeInTheDocument()
  })

  it('shows a visible error and does not add a listing when the title is empty', async () => {
    const user = userEvent.setup()
    renderApp('/create')

    await fillRequiredFields(user, { title: '' })
    await user.click(screen.getByRole('button', { name: 'Post Listing' }))

    expect(await screen.findByText('Listing title is required.')).toBeInTheDocument()
    // Did not navigate away from the create screen.
    expect(screen.getByRole('heading', { name: 'Create a Listing' })).toBeInTheDocument()
  })

  it('shows a visible error when Available Until is earlier than Available From', async () => {
    const user = userEvent.setup()
    renderApp('/create')

    await fillRequiredFields(user, {
      availableFrom: '2026-02-01',
      availableUntil: '2026-01-01',
    })
    await user.click(screen.getByRole('button', { name: 'Post Listing' }))

    expect(
      await screen.findByText('Available Until cannot be earlier than Available From.'),
    ).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Create a Listing' })).toBeInTheDocument()
  })

  it('posts successfully with zero tips filled and navigates to the listings page', async () => {
    const user = userEvent.setup()
    renderApp('/create')

    await fillRequiredFields(user)
    await user.click(screen.getByRole('button', { name: 'Post Listing' }))

    expect(await screen.findByRole('heading', { name: 'All Listings' })).toBeInTheDocument()
    expect(screen.getByText('Cozy Loft')).toBeInTheDocument()
  })
})
