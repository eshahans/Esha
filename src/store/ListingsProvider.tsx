import { useCallback, useMemo, useState, type ReactNode } from 'react'
import type { Listing, NewListingInput } from '../types/listing'
import { ListingsContext } from './ListingsContext'

/**
 * Holds every listing created during this session, in memory only.
 *
 * Deliberately no localStorage/sessionStorage/IndexedDB/backend/network
 * call of any kind — a browser refresh is expected to clear this store,
 * that is intended behaviour for this build, not a defect.
 *
 * Must be mounted above the router (see `main.tsx`) so client-side
 * navigation between routes never unmounts this provider and never
 * resets the listings it holds.
 */
export function ListingsProvider({ children }: { children: ReactNode }) {
  const [listings, setListings] = useState<Listing[]>([])

  const addListing = useCallback((input: NewListingInput): Listing => {
    const listing: Listing = { id: crypto.randomUUID(), ...input }
    setListings((current) => [...current, listing])
    return listing
  }, [])

  const value = useMemo(() => ({ listings, addListing }), [listings, addListing])

  return <ListingsContext.Provider value={value}>{children}</ListingsContext.Provider>
}
