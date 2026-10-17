export interface Product {
  id: number | string
  name: string
  nameAr: string
  description: string
  descriptionAr: string
  price: number
  originalPrice?: number
  image: string
  category: string
  categoryAr: string
  inStock: number
  featured?: boolean
}

export interface CartItem {
  id: number | string
  name: string
  nameAr: string
  price: number
  quantity: number
  image: string
}

export interface CustomerOrderInfo {
  name: string
  phone: string
  address: string
  city: string
}
