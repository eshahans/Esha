import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { App } from '../App'
import { ListingsProvider } from '../store/ListingsProvider'

/**
 * Renders the real component tree (provider above router, same as
 * `main.tsx`) at a given starting route, so page tests exercise the same
 * wiring Req 4 requires rather than a page component in isolation.
 */
export function renderApp(initialPath = '/') {
  return render(
    <ListingsProvider>
      <MemoryRouter initialEntries={[initialPath]}>
        <App />
      </MemoryRouter>
    </ListingsProvider>,
  )
}
