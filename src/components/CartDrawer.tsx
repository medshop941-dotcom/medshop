'use client'

import { useCart } from '@/context/CartContext'
import { useLanguage } from '@/context/LanguageContext'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  MOROCCAN_CITIES,
  generateWhatsAppOrderUrl,
  isValidMoroccanPhone,
  calculateDelivery,
} from '@/lib/constants'
import { X, Plus, Minus, Trash2, ShoppingBag, Send, ArrowRight, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { saveOrderAction } from '@/app/actions/orders'

export function CartDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null

  return <CartDrawerContent onClose={onClose} />
}

function CartDrawerContent({ onClose }: { onClose: () => void }) {
  const { cart, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart()
  const { t, isRtl } = useLanguage()
  const [showCheckout, setShowCheckout] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: MOROCCAN_CITIES[0] as string,
  })

  // Scroll lock & Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  const { fee, isFree } = calculateDelivery(cartTotal)
  const finalTotal = cartTotal + fee

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
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

    // Save order in database
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

    const orderUrl = generateWhatsAppOrderUrl({
      customer: formData,
      items: cart,
      language: isRtl ? 'ar' : 'fr',
    })

    window.open(orderUrl, '_blank')
    clearCart()
    toast.success(
      isRtl
        ? 'تم تسجيل طلبك وإرساله عبر واتساب بنجاح!'
        : 'Commande enregistrée et envoyée sur WhatsApp !'
    )
    onClose()
  }

  const handleItemRemove = (id: number) => {
    removeFromCart(id)
    toast.info(t.toasts.removedFromCart)
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Container */}
      <div
        className={`fixed top-0 bottom-0 ${
          isRtl ? 'left-0' : 'right-0'
        } h-full w-full max-w-md bg-white shadow-2xl flex flex-col z-50 animate-in ${
          isRtl ? 'slide-in-from-left' : 'slide-in-from-right'
        } duration-300`}
      >
        {/* Header */}
        <div className="p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/70">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-gold" />
            <h2 className="text-lg font-bold text-neutral-900">
              {showCheckout ? t.cart.checkoutTitle : t.cart.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.common.close}
            className="p-2 text-neutral-500 hover:text-neutral-900 rounded-full hover:bg-neutral-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {showCheckout ? (
            /* WhatsApp Checkout Form */
            <form onSubmit={handleCheckoutSubmit} className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900 leading-relaxed">
                {t.products.instantBuyDesc}
              </div>

              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
                  {errorMessage}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                  {t.checkout.fullName} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={t.checkout.fullNamePlaceholder}
                  className="w-full border border-neutral-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                  {t.checkout.phone} <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder={t.checkout.phonePlaceholder}
                  dir="ltr"
                  className="w-full border border-neutral-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                  {t.checkout.city} <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full border border-neutral-300 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold"
                >
                  {MOROCCAN_CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                  {t.checkout.address} <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder={t.checkout.addressPlaceholder}
                  className="w-full border border-neutral-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold"
                />
              </div>

              <div className="bg-neutral-50 p-3.5 rounded-xl border border-neutral-200 text-xs space-y-1.5">
                <div className="flex justify-between text-neutral-600">
                  <span>{t.cart.subtotal}</span>
                  <span className="font-semibold">{cartTotal} {t.common.currency}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>{t.cart.delivery}</span>
                  <span className="font-semibold">{isFree ? t.cart.freeDelivery : `${fee} ${t.common.currency}`}</span>
                </div>
                <div className="border-t border-neutral-200 pt-2 flex justify-between font-bold text-neutral-900 text-sm">
                  <span>{t.cart.total}</span>
                  <span className="text-gold">{finalTotal} {t.common.currency}</span>
                </div>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCheckout(false)}
                  className="flex-1 border border-neutral-300 py-3 rounded-xl font-semibold text-neutral-700 hover:bg-neutral-100 transition-colors text-sm cursor-pointer"
                >
                  {t.cart.backToCart}
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gold-gradient text-black py-3 rounded-xl font-bold hover:bg-gold-gradient-dark transition-all duration-200 shadow-gold text-sm inline-flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{t.products.buyNow}</span>
                </button>
              </div>
            </form>
          ) : (
            /* Cart Items List */
            <>
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-neutral-900 mb-1">
                      {t.cart.emptyTitle}
                    </h3>
                    <p className="text-xs text-neutral-500 max-w-xs">
                      {t.cart.emptyDesc}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    className="mt-2 inline-flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-neutral-800 transition-colors cursor-pointer"
                  >
                    <span>{t.cart.continueShopping}</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-3.5 p-3.5 bg-neutral-50 rounded-2xl border border-neutral-100 relative group"
                    >
                      {/* Product Thumbnail */}
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-white shrink-0 border border-neutral-200">
                        <Image
                          src={item.image}
                          alt={isRtl ? item.nameAr : item.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>

                      {/* Info & Quantity */}
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div>
                          <h4 className="font-semibold text-sm text-neutral-900 truncate">
                            {isRtl ? item.nameAr : item.name}
                          </h4>
                          <p className="text-gold font-bold text-sm">
                            {item.price} {t.common.currency}
                          </p>
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          <div className="inline-flex items-center border border-neutral-300 rounded-lg bg-white p-0.5">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              aria-label="Decrease quantity"
                              className="w-7 h-7 flex items-center justify-center text-neutral-600 hover:text-black rounded cursor-pointer"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-7 text-center font-bold text-xs text-neutral-900">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              aria-label="Increase quantity"
                              className="w-7 h-7 flex items-center justify-center text-neutral-600 hover:text-black rounded cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <span className="font-bold text-sm text-neutral-900">
                            {item.price * item.quantity} {t.common.currency}
                          </span>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => handleItemRemove(item.id)}
                        aria-label={t.cart.remove}
                        className="text-neutral-400 hover:text-red-500 p-1.5 transition-colors cursor-pointer self-start"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Order Summary */}
        {!showCheckout && cart.length > 0 && (
          <div className="p-5 border-t border-neutral-100 bg-neutral-50/80 space-y-3">
            <div className="space-y-1.5 text-xs text-neutral-600">
              <div className="flex justify-between">
                <span>{t.cart.subtotal}</span>
                <span className="font-bold text-neutral-900">
                  {cartTotal} {t.common.currency}
                </span>
              </div>
              <div className="flex justify-between">
                <span>{t.cart.delivery}</span>
                <span className="font-bold text-neutral-900">
                  {isFree ? (
                    <span className="text-green-600 font-bold">{t.cart.freeDelivery}</span>
                  ) : (
                    `${fee} ${t.common.currency}`
                  )}
                </span>
              </div>
              <div className="border-t border-neutral-200 pt-2 flex justify-between text-base font-black text-neutral-900">
                <span>{t.cart.total}</span>
                <span className="text-gold text-lg">
                  {finalTotal} {t.common.currency}
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => setShowCheckout(true)}
                className="w-full bg-gold-gradient text-black py-3.5 rounded-xl font-bold hover:bg-gold-gradient-dark transition-all duration-200 shadow-gold text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{t.cart.proceedToOrder}</span>
              </button>

              <Link
                href="/checkout"
                onClick={onClose}
                className="w-full border border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-800 py-3 rounded-xl font-bold transition-colors text-xs flex items-center justify-center gap-1.5 text-center cursor-pointer"
              >
                <span>{t.cart.checkout}</span>
                {isRtl ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
