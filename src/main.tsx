import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { App } from './App'
import './index.css'
import { ListingsProvider } from './store/ListingsProvider'

// The store provider sits above the router (Req 4) so a client-side route
// change can never unmount it and never reset the listings it holds.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ListingsProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ListingsProvider>
  </StrictMode>,
)
