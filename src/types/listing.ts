/**
 * A single sublet listing created by a host.
 *
 * `price` is deliberately a free-text string (PRD §4's own example is
 * `"$1,200/month"`), not a number — it carries a currency symbol and a
 * billing period. Do not "fix" this to a numeric type; a future sprint
 * can migrate it if sorting/filtering by price is ever needed.
 */
export interface Listing {
  id: string
  title: string
  neighbourhood: string
  price: string
  availableFrom: string
  availableUntil: string
  tipFood: string
  tipActivity: string
  tipNeighbourhood: string
}

/**
 * The fields a host fills in on the create-listing form. Same shape as
 * `Listing` minus `id`, which the store generates when the listing is
 * added (see `store/ListingsProvider.tsx`) — never derived from the
 * listing's position in the array, since sprint 2 routes on it.
 */
export type NewListingInput = Omit<Listing, 'id'>
