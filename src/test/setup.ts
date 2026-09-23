import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'
import '@testing-library/jest-dom/vitest'

// Not using vitest's `globals` mode, so testing-library's automatic
// post-test unmount doesn't kick in on its own — without this, each new
// `render()` in a file leaves the previous test's DOM in place and
// queries start matching duplicate elements across tests.
afterEach(() => {
  cleanup()
})
