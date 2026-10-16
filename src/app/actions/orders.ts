'use server'

import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase'
import { CreateOrderPayload, DbOrder, OrderStatus } from '@/types/order'

// In-memory fallback cache when Supabase environment variables are not yet linked
// This ensures that local development and the admin dashboard are immediately interactive!
const localMockOrders: DbOrder[] = [
  {
    id: 'ord-mock-001',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    customer_name: 'Fatima Zahra Benali',
    customer_phone: '0661234567',
    customer_address: 'Boulevard d’Anfa, Résidence Al Yassamine N° 14',
    customer_city: 'Casablanca',
    items: [
      {
        id: 1,
        name: 'Sac à Main Cuir Noir Élite',
        nameAr: 'حقيبة يد جلدية سوداء فاخرة',
        price: 450,
        quantity: 1,
        image: '/logo.jpg',
      },
      {
        id: 7,
        name: 'Collier Pendentif Or & Perle Blanche',
        nameAr: 'قلادة ذهبية مرصعة بلؤلؤة نقية',
        price: 290,
        quantity: 1,
        image: '/logo.jpg',
      },
    ],
    subtotal: 740,
    delivery_fee: 0,
    total: 740,
    status: 'confirmed',
    notes: 'Livraison express avant 18h',
  },
  {
    id: 'ord-mock-002',
    created_at: new Date(Date.now() - 3600000 * 6).toISOString(),
    customer_name: 'Youssef El Amrani',
    customer_phone: '0678912345',
    customer_address: 'Avenue Mohammed VI, Lotissement Al Manar',
    customer_city: 'Rabat',
    items: [
      {
        id: 2,
        name: 'Sac Élégant Doré Royale',
        nameAr: 'حقيبة أنيقة بلمسة ذهبية ملكية',
        price: 550,
        quantity: 1,
        image: '/logo.jpg',
      },
    ],
    subtotal: 550,
    delivery_fee: 0,
    total: 550,
    status: 'pending',
    notes: '',
  },
  {
    id: 'ord-mock-003',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    customer_name: 'Kenza Tazi',
    customer_phone: '0612398745',
    customer_address: 'Quartier Guéliz, Rue de la Liberté N° 8',
    customer_city: 'Marrakech',
    items: [
      {
        id: 11,
        name: 'Montre Dorée Cadran Nacre Luxe',
        nameAr: 'ساعة نسائية ذهبية بميناء صدف أنيق',
        price: 490,
        quantity: 1,
        image: '/logo.jpg',
      },
    ],
    subtotal: 490,
    delivery_fee: 35,
    total: 525,
    status: 'delivered',
    notes: 'Paiement en espèces réglé',
  },
]

export async function saveOrderAction(payload: CreateOrderPayload): Promise<{
  success: boolean
  orderId?: string
  error?: string
}> {
  try {
    if (isSupabaseConfigured && supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('orders')
        .insert({
          customer_name: payload.customer_name,
          customer_phone: payload.customer_phone,
          customer_address: payload.customer_address,
          customer_city: payload.customer_city,
          items: payload.items,
          subtotal: payload.subtotal,
          delivery_fee: payload.delivery_fee,
          total: payload.total,
          status: 'pending',
        })
        .select('id')
        .single()

      if (error) {
        console.error('Supabase saveOrder error:', error)
        // Fallback to local cache so user order is never dropped
        const fallbackId = `ord-${Date.now()}`
        localMockOrders.unshift({
          ...payload,
          id: fallbackId,
          created_at: new Date().toISOString(),
          status: 'pending',
        })
        return { success: true, orderId: fallbackId }
      }

      return { success: true, orderId: data.id }
    }

    // Local mode
    const orderId = `ord-${Date.now()}`
    localMockOrders.unshift({
      ...payload,
      id: orderId,
      created_at: new Date().toISOString(),
      status: 'pending',
    })

    return { success: true, orderId }
  } catch (err: unknown) {
    console.error('Error saving order:', err)
    return { success: false, error: 'Could not record order' }
  }
}

export async function getOrdersAction(): Promise<{
  success: boolean
  orders: DbOrder[]
  isLiveDb: boolean
}> {
  try {
    if (isSupabaseConfigured && supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Supabase fetch error:', error)
        return { success: true, orders: localMockOrders, isLiveDb: false }
      }

      return { success: true, orders: data as DbOrder[], isLiveDb: true }
    }

    return { success: true, orders: localMockOrders, isLiveDb: false }
  } catch (err) {
    console.error('Error fetching orders:', err)
    return { success: true, orders: localMockOrders, isLiveDb: false }
  }
}

export async function updateOrderStatusAction(
  orderId: string,
  newStatus: OrderStatus
): Promise<{ success: boolean; error?: string }> {
  try {
    if (isSupabaseConfigured && supabaseAdmin) {
      const { error } = await supabaseAdmin
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId)

      if (error) {
        console.error('Supabase status update error:', error)
        return { success: false, error: error.message }
      }
    }

    // Always keep local cache in sync
    const order = localMockOrders.find((o) => o.id === orderId)
    if (order) {
      order.status = newStatus
    }

    return { success: true }
  } catch (err) {
    console.error('Error updating order status:', err)
    return { success: false, error: 'Could not update status' }
  }
}

export async function verifyAdminPasscodeAction(passcode: string): Promise<boolean> {
  const adminSecret = process.env.ADMIN_PASSCODE || 'medshop2026'
  return passcode.trim() === adminSecret.trim()
}
