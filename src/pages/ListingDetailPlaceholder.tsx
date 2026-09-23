import { Link, useParams } from 'react-router-dom'

/**
 * Placeholder destination for a listing row's click target (Req 8). The
 * real detail screen (PRD §6) is sprint 2's scope — this route exists
 * only so the listings-page row has somewhere real to land instead of a
 * 404, per Req 8's instruction to wire the target without building the
 * detail page here.
 */
export function ListingDetailPlaceholder() {
  const { id } = useParams<{ id: string }>()

  return (
    <section>
      <h1>Listing detail</h1>
      <p>The detail page for listing {id} is coming in a future sprint.</p>
      <p>
        <Link to="/listings">Back to all listings</Link>
      </p>
    </section>
  )
}
