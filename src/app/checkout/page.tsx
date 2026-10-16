'use client'

import { useCart } from '@/context/CartContext'
import { useLanguage } from '@/context/LanguageContext'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  MOROCCAN_CITIES,
  generateWhatsAppOrderUrl,
  isValidMoroccanPhone,
  calculateDelivery,
} from '@/lib/constants'
import { Send, ShoppingBag, ArrowLeft, ArrowRight, ShieldCheck, Truck } from 'lucide-react'
import { toast } from 'sonner'
import { saveOrderAction } from '@/app/actions/orders'

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart()
  const { t, isRtl } = useLanguage()
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: MOROCCAN_CITIES[0] as string,
  })

  const [errorMessage, setErrorMessage] = useState('')

  const { fee, isFree } = calculateDelivery(cartTotal)
  const finalTotal = cartTotal + fee

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')

    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim()) {
      setErrorMessage(t.checkout.validationError)
      return
    }

    if (!isValidMoroccanPhone(formData.phone)) {
      setErrorMessage(t.checkout.phoneInvalid)
      return
    }

    // 1. Record order in database
    await saveOrderAction({
      customer_name: formData.name,
      customer_phone: formData.phone,
      customer_address: formData.address,
      customer_city: formData.city,
      items: cart,
      subtotal: cartTotal,
      delivery_fee: fee,
      total: finalTotal,
    })

    // 2. Generate WhatsApp order URL
    const orderUrl = generateWhatsAppOrderUrl({
      customer: formData,
      items: cart,
      language: isRtl ? 'ar' : 'fr',
    })

    // 3. Open WhatsApp & clear state
    window.open(orderUrl, '_blank')
    clearCart()
    toast.success(
      isRtl
        ? 'تم تسجيل طلبك وإرساله عبر واتساب بنجاح!'
        : 'Votre commande a été enregistrée et transmise sur WhatsApp !'
    )
    router.push('/')
  }

  if (cart.length === 0) {
    return (
      <div className="py-24 text-center">
        <div className="container mx-auto px-4 max-w-md">
          <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4 text-neutral-400">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">
            {t.checkout.title}
          </h1>
          <p className="text-neutral-500 text-sm mb-6">
            {t.cart.emptyDesc}
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-gold-gradient text-black px-6 py-3 rounded-xl font-bold hover:bg-gold-gradient-dark transition-all duration-200 shadow-gold text-sm cursor-pointer"
          >
            <span>{t.cart.continueShopping}</span>
            {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="py-8 md:py-16 bg-neutral-50/50 min-h-[80vh]">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-2xl md:text-4xl font-black text-neutral-900 mb-8 tracking-tight">
          {t.checkout.title}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Checkout Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-200/80 p-6 md:p-8">
            <h2 className="text-lg font-bold text-neutral-900 mb-6 pb-3 border-b border-neutral-100 flex items-center gap-2">
              <span>{t.checkout.yourInfo}</span>
            </h2>

            {errorMessage && (
              <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                  {t.checkout.fullName} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-neutral-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold transition-colors"
                  placeholder={t.checkout.fullNamePlaceholder}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                  {t.checkout.phone} <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full border border-neutral-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold transition-colors"
                  placeholder={t.checkout.phonePlaceholder}
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                  {t.checkout.city} <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full border border-neutral-300 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold transition-colors"
                >
                  {MOROCCAN_CITIES.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                  {t.checkout.address} <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full border border-neutral-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold transition-colors"
                  placeholder={t.checkout.addressPlaceholder}
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-gold-gradient text-black py-4 rounded-xl font-bold hover:bg-gold-gradient-dark transition-all duration-200 shadow-gold text-base flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-5 h-5" />
                  <span>{t.checkout.placeOrder}</span>
                </button>
              </div>

              <div className="pt-4 flex items-center justify-center gap-2 text-xs text-neutral-500 text-center">
                <ShieldCheck className="w-4 h-4 text-gold shrink-0" />
                <span>{t.checkout.paymentMethod}</span>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-200/80 p-6 md:p-8 space-y-6">
            <h2 className="text-lg font-bold text-neutral-900 pb-3 border-b border-neutral-100">
              {t.checkout.orderSummary}
            </h2>

            <div className="space-y-3 divide-y divide-neutral-100 max-h-80 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.id} className="pt-3 first:pt-0 flex justify-between items-center text-sm">
                  <div>
                    <p className="font-bold text-neutral-900">
                      {isRtl ? item.nameAr : item.name}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {item.quantity} × {item.price} {t.common.currency}
                    </p>
                  </div>
                  <p className="font-black text-neutral-900">
                    {item.price * item.quantity} {t.common.currency}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-neutral-200 pt-4 space-y-3 text-sm">
              <div className="flex justify-between text-neutral-600">
                <span>{t.cart.subtotal}</span>
                <span className="font-semibold text-neutral-900">
                  {cartTotal} {t.common.currency}
                </span>
              </div>

              <div className="flex justify-between text-neutral-600">
                <span>{t.cart.delivery}</span>
                <span className="font-semibold text-neutral-900">
                  {isFree ? (
                    <span className="text-green-600 font-bold">{t.cart.freeDelivery}</span>
                  ) : (
                    `${fee} ${t.common.currency}`
                  )}
                </span>
              </div>

              <div className="border-t border-neutral-200 pt-3 flex justify-between items-baseline">
                <span className="font-bold text-base text-neutral-900">{t.cart.total}</span>
                <span className="font-black text-2xl text-gold">
                  {finalTotal} {t.common.currency}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 flex items-center gap-3 text-xs text-neutral-600">
              <Truck className="w-5 h-5 text-gold shrink-0" />
              <span>
                {isRtl
                  ? 'يتم تسليم الطلبية خلال 24 إلى 48 ساعة مع خدمة تتبع الشحنة.'
                  : 'Expédition soignée et remise en main propre sous 24 à 48 heures.'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
