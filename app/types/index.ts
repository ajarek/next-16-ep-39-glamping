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
