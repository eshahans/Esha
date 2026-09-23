import { Link, Route, Routes } from 'react-router-dom'
import { CreateListingPage } from './pages/CreateListingPage'
import { ListingDetailPlaceholder } from './pages/ListingDetailPlaceholder'
import { ListingsPage } from './pages/ListingsPage'

export function App() {
  return (
    <div className="app">
      <nav className="app-nav">
        <Link to="/listings">All Listings</Link>
        <Link to="/create">Create a Listing</Link>
      </nav>
      <main>
        <Routes>
          <Route path="/" element={<ListingsPage />} />
          <Route path="/listings" element={<ListingsPage />} />
          <Route path="/listings/:id" element={<ListingDetailPlaceholder />} />
          <Route path="/create" element={<CreateListingPage />} />
        </Routes>
      </main>
    </div>
  )
}
