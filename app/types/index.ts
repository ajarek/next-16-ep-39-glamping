export interface Location {
  id: string
  name: string
  locationName: string
  description: string
  price: number
  rating: number
  image: string
  tags: string[]
  coords: { x: number; y: number }
  details: string
  features: string[]
}

export interface Booking {
  id: string
  bookingCode: string
  locationId: string
  locationName: string
  startDate: string
  endDate: string
  guestsCount: number
  fullName: string
  email: string
  phone: string
  addons: string[]
  totalPrice: number
  createdAt?: string
}
