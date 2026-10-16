import { CartItem, CustomerOrderInfo } from '@/types/product'

export const MOROCCAN_CITIES = [
  'Casablanca',
  'Rabat',
  'Marrakech',
  'Tanger',
  'Fès',
  'Agadir',
  'Meknès',
  'Oujda',
  'Kénitra',
  'Tétouan',
  'Safi',
  'Mohammédia',
  'El Jadida',
  'Nador',
  'Béni Mellal',
] as const

export const FREE_DELIVERY_THRESHOLD = 500
export const STANDARD_DELIVERY_FEE = 35

export const STORE_PHONE_DISPLAY = '+212 600 000 000'
export const STORE_PHONE_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '212600000000'

export function calculateDelivery(subtotal: number): { fee: number; isFree: boolean } {
  const isFree = subtotal >= FREE_DELIVERY_THRESHOLD
  return {
    fee: isFree ? 0 : STANDARD_DELIVERY_FEE,
    isFree,
  }
}

export function isValidMoroccanPhone(phone: string): boolean {
  // Accepts formats like: 0612345678, 0712345678, +212612345678, +212712345678, 05...
  const cleaned = phone.replace(/[\s.-]/g, '')
  const regex = /^(?:\+212|00212|0)[5-7]\d{8}$/
  return regex.test(cleaned)
}

export function generateWhatsAppOrderUrl(params: {
  customer: CustomerOrderInfo
  items: CartItem[]
  language: 'fr' | 'ar'
}): string {
  const { customer, items, language } = params
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const { fee } = calculateDelivery(subtotal)
  const total = subtotal + fee

  const isAr = language === 'ar'

  const itemsList = items
    .map(
      (item) =>
        `- ${isAr ? item.nameAr : item.name} (${item.quantity}x) - ${item.price * item.quantity} DH\n`
    )
    .join('')

  const message = isAr
    ? `🛍️ *طلب جديد - متجر Med Shop*\n\n` +
      `👤 *الاسم:* ${customer.name}\n` +
      `📞 *الهاتف:* ${customer.phone}\n` +
      `📍 *العنوان:* ${customer.address}\n` +
      `🏙️ *المدينة:* ${customer.city}\n\n` +
      `📦 *المنتجات:*\n` +
      itemsList +
      `\n` +
      `💰 *المجموع:* ${total} DH (التوصيل: ${fee === 0 ? 'مجاني' : `${fee} DH`})\n` +
      `💳 *الدفع:* عند الاستلام\n\n` +
      `شكراً لتأكيد الطلب!`
    : `🛍️ *Nouvelle Commande - Med Shop*\n\n` +
      `👤 *Client:* ${customer.name}\n` +
      `📞 *Téléphone:* ${customer.phone}\n` +
      `📍 *Adresse:* ${customer.address}\n` +
      `🏙️ *Ville:* ${customer.city}\n\n` +
      `📦 *Commande:*\n` +
      itemsList +
      `\n` +
      `💰 *Total:* ${total} DH (Livraison: ${fee === 0 ? 'Gratuite' : `${fee} DH`})\n` +
      `💳 *Paiement:* À la livraison\n\n` +
      `Merci de confirmer la commande!`

  return `https://wa.me/${STORE_PHONE_NUMBER}?text=${encodeURIComponent(message)}`
}
