import { createContext } from 'react'
import type { Listing, NewListingInput } from '../types/listing'

export interface ListingsContextValue {
  listings: Listing[]
  addListing: (input: NewListingInput) => Listing
}

export const ListingsContext = createContext<ListingsContextValue | undefined>(undefined)
