import { useState, type ChangeEvent, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useListings } from '../store/useListings'

const initialFormState = {
  title: '',
  neighbourhood: '',
  price: '',
  availableFrom: '',
  availableUntil: '',
  tipFood: '',
  tipActivity: '',
  tipNeighbourhood: '',
}

type FormField = keyof typeof initialFormState

type FieldErrors = Partial<
  Record<'title' | 'neighbourhood' | 'price' | 'availableFrom' | 'availableUntil', string>
>

function validate(form: typeof initialFormState): FieldErrors {
  const errors: FieldErrors = {}

  if (!form.title.trim()) errors.title = 'Listing title is required.'
  if (!form.neighbourhood.trim()) errors.neighbourhood = 'Neighbourhood is required.'
  if (!form.price.trim()) errors.price = 'Price is required.'
  if (!form.availableFrom) errors.availableFrom = 'Available From date is required.'
  if (!form.availableUntil) errors.availableUntil = 'Available Until date is required.'

  // Tips (tipFood, tipActivity, tipNeighbourhood) are intentionally not
  // validated — PRD §9 allows "up to three" tips, so zero or one filled in
  // must still post successfully.

  if (
    form.availableFrom &&
    form.availableUntil &&
    form.availableUntil < form.availableFrom
  ) {
    errors.availableUntil = 'Available Until cannot be earlier than Available From.'
  }

  return errors
}

export function CreateListingPage() {
  const { addListing } = useListings()
  const navigate = useNavigate()
  const [form, setForm] = useState(initialFormState)
  const [errors, setErrors] = useState<FieldErrors>({})

  function handleChange(field: FormField) {
    return (event: ChangeEvent<HTMLInputElement>) => {
      setForm((current) => ({ ...current, [field]: event.target.value }))
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextErrors = validate(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      return
    }

    addListing({
      title: form.title.trim(),
      neighbourhood: form.neighbourhood.trim(),
      price: form.price.trim(),
      availableFrom: form.availableFrom,
      availableUntil: form.availableUntil,
      tipFood: form.tipFood.trim(),
      tipActivity: form.tipActivity.trim(),
      tipNeighbourhood: form.tipNeighbourhood.trim(),
    })

    navigate('/listings')
  }

  return (
    <section>
      <h1>Create a Listing</h1>
      <form onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="title">Listing Title</label>
          <input id="title" value={form.title} onChange={handleChange('title')} />
          {errors.title && (
            <p className="field-error" role="alert">
              {errors.title}
            </p>
          )}
        </div>

        <div className="field">
          <label htmlFor="neighbourhood">Neighbourhood</label>
          <input
            id="neighbourhood"
            value={form.neighbourhood}
            onChange={handleChange('neighbourhood')}
          />
          {errors.neighbourhood && (
            <p className="field-error" role="alert">
              {errors.neighbourhood}
            </p>
          )}
        </div>

        <div className="field">
          <label htmlFor="price">Price</label>
          <input
            id="price"
            placeholder="$1,200/month"
            value={form.price}
            onChange={handleChange('price')}
          />
          {errors.price && (
            <p className="field-error" role="alert">
              {errors.price}
            </p>
          )}
        </div>

        <div className="field">
          <label htmlFor="availableFrom">Available From</label>
          <input
            id="availableFrom"
            type="date"
            value={form.availableFrom}
            onChange={handleChange('availableFrom')}
          />
          {errors.availableFrom && (
            <p className="field-error" role="alert">
              {errors.availableFrom}
            </p>
          )}
        </div>

        <div className="field">
          <label htmlFor="availableUntil">Available Until</label>
          <input
            id="availableUntil"
            type="date"
            value={form.availableUntil}
            onChange={handleChange('availableUntil')}
          />
          {errors.availableUntil && (
            <p className="field-error" role="alert">
              {errors.availableUntil}
            </p>
          )}
        </div>

        <div className="field">
          <label htmlFor="tipFood">Local tip: food/coffee</label>
          <input id="tipFood" value={form.tipFood} onChange={handleChange('tipFood')} />
        </div>

        <div className="field">
          <label htmlFor="tipActivity">Local tip: activity/place</label>
          <input id="tipActivity" value={form.tipActivity} onChange={handleChange('tipActivity')} />
        </div>

        <div className="field">
          <label htmlFor="tipNeighbourhood">Local tip: neighbourhood</label>
          <input
            id="tipNeighbourhood"
            value={form.tipNeighbourhood}
            onChange={handleChange('tipNeighbourhood')}
          />
        </div>

        <button type="submit">Post Listing</button>
      </form>
    </section>
  )
}
