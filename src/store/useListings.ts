import { useContext } from 'react'
import { ListingsContext, type ListingsContextValue } from './ListingsContext'

export function useListings(): ListingsContextValue {
  const context = useContext(ListingsContext)
  if (!context) {
    throw new Error('useListings must be used within a ListingsProvider')
  }
  return context
}
