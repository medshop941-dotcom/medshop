import { CartItem } from './product'

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'

export interface DbOrder {
  id: string
  created_at: string
  customer_name: string
  customer_phone: string
  customer_address: string
  customer_city: string
  items: CartItem[]
  subtotal: number
  delivery_fee: number
  total: number
  status: OrderStatus
  notes?: string
}

export interface CreateOrderPayload {
  customer_name: string
  customer_phone: string
  customer_address: string
  customer_city: string
  items: CartItem[]
  subtotal: number
  delivery_fee: number
  total: number
}
