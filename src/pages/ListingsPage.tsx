import { Link } from 'react-router-dom'
import { useListings } from '../store/useListings'
import { formatDate } from '../utils/formatDate'

export function ListingsPage() {
  const { listings } = useListings()

  if (listings.length === 0) {
    return (
      <section>
        <h1>All Listings</h1>
        <p>No listings yet.</p>
        <p>
          <Link to="/create">Create the first listing</Link>
        </p>
      </section>
    )
  }

  return (
    <section>
      <h1>All Listings</h1>
      <ul className="listings">
        {listings.map((listing) => (
          <li key={listing.id}>
            <Link to={`/listings/${listing.id}`} className="listing-row">
              <span className="listing-title">{listing.title}</span>
              <span className="listing-neighbourhood">{listing.neighbourhood}</span>
              <span className="listing-price">{listing.price}</span>
              <span className="listing-dates">
                {formatDate(listing.availableFrom)} – {formatDate(listing.availableUntil)}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
