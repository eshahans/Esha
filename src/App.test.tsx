import { fireEvent, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from './test/renderApp'

describe('App navigation', () => {
  it('keeps listings in the store when navigating between screens (Req 4)', async () => {
    const user = userEvent.setup()
    renderApp('/create')

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

    expect(await screen.findByText('Cozy Loft')).toBeInTheDocument()

    await user.click(screen.getByRole('link', { name: 'Create a Listing' }))
    expect(screen.getByRole('heading', { name: 'Create a Listing' })).toBeInTheDocument()

    await user.click(screen.getByRole('link', { name: 'All Listings' }))
    expect(await screen.findByText('Cozy Loft')).toBeInTheDocument()
  })
})
