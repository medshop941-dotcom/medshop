'use client'

import { useLanguage } from '@/context/LanguageContext'
import { useCart } from '@/context/CartContext'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Product } from '@/types/product'
import {
  MOROCCAN_CITIES,
  generateWhatsAppOrderUrl,
  isValidMoroccanPhone,
  calculateDelivery,
} from '@/lib/constants'
import { X, Plus, Minus, ShoppingBag, Send, ShieldCheck, Truck } from 'lucide-react'
import { toast } from 'sonner'
import { saveOrderAction } from '@/app/actions/orders'

interface ProductDrawerProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
}

export function ProductDrawer({ product, isOpen, onClose }: ProductDrawerProps) {
  if (!isOpen || !product) return null

  return <ProductDrawerContent key={product.id} product={product} onClose={onClose} />
}

function ProductDrawerContent({ product, onClose }: { product: Product; onClose: () => void }) {
  const { t, isRtl } = useLanguage()
  const { addToCart } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [showInstantBuy, setShowInstantBuy] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    address: '',
    city: MOROCCAN_CITIES[0] as string,
  })

  // Handle Escape key and body scroll-lock
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

  const handleAddToCart = () => {
    addToCart(
      {
        id: product.id,
        name: product.name,
        nameAr: product.nameAr,
        price: product.price,
        image: product.image,
      },
      quantity
    )
    toast.success(
      isRtl
        ? `تمت إضافة "${product.nameAr}" (${quantity}) إلى السلة`
        : `"${product.name}" (${quantity}) a été ajouté au panier`
    )
    onClose()
  }

  const handleInstantBuy = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')

    if (!customerInfo.name.trim() || !customerInfo.phone.trim() || !customerInfo.address.trim()) {
      setErrorMessage(t.checkout.validationError)
      return
    }

    if (!isValidMoroccanPhone(customerInfo.phone)) {
      setErrorMessage(t.checkout.phoneInvalid)
      return
    }

    const currentSubtotal = product.price * quantity
    const { fee } = calculateDelivery(currentSubtotal)
    const currentTotal = currentSubtotal + fee

    // Save order in database
    await saveOrderAction({
      customer_name: customerInfo.name,
      customer_phone: customerInfo.phone,
      customer_address: customerInfo.address,
      customer_city: customerInfo.city,
      items: [
        {
          id: product.id,
          name: product.name,
          nameAr: product.nameAr,
          price: product.price,
          quantity,
          image: product.image,
        },
      ],
      subtotal: currentSubtotal,
      delivery_fee: fee,
      total: currentTotal,
    })

    const orderUrl = generateWhatsAppOrderUrl({
      customer: customerInfo,
      items: [
        {
          id: product.id,
          name: product.name,
          nameAr: product.nameAr,
          price: product.price,
          quantity,
          image: product.image,
        },
      ],
      language: isRtl ? 'ar' : 'fr',
    })

    window.open(orderUrl, '_blank')
    toast.success(
      isRtl
        ? 'تم تسجيل طلبك وإرساله عبر واتساب بنجاح!'
        : 'Commande enregistrée et envoyée sur WhatsApp !'
    )
    onClose()
  }

  const subtotal = product.price * quantity
  const { fee, isFree } = calculateDelivery(subtotal)
  const total = subtotal + fee

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div
        className={`fixed top-0 bottom-0 ${
          isRtl ? 'left-0' : 'right-0'
        } h-full w-full max-w-lg bg-white shadow-2xl flex flex-col z-50 animate-in ${
          isRtl ? 'slide-in-from-left' : 'slide-in-from-right'
        } duration-300`}
      >
        {/* Header */}
        <div className="p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/70">
          <h2 className="text-lg font-bold text-neutral-900 truncate">
            {showInstantBuy ? t.products.instantBuyTitle : isRtl ? product.nameAr : product.name}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.common.close}
            className="p-2 text-neutral-500 hover:text-neutral-900 rounded-full hover:bg-neutral-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {showInstantBuy ? (
            /* Instant WhatsApp Checkout Form */
            <form onSubmit={handleInstantBuy} className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 leading-relaxed">
                {t.products.instantBuyDesc}
              </div>

              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
                  {errorMessage}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                  {t.checkout.fullName} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                  placeholder={t.checkout.fullNamePlaceholder}
                  className="w-full border border-neutral-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                  {t.checkout.phone} <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                  placeholder={t.checkout.phonePlaceholder}
                  dir="ltr"
                  className="w-full border border-neutral-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                  {t.checkout.city} <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={customerInfo.city}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, city: e.target.value })}
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
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                  {t.checkout.address} <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  value={customerInfo.address}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                  placeholder={t.checkout.addressPlaceholder}
                  className="w-full border border-neutral-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold"
                />
              </div>

              {/* Summary inside instant modal */}
              <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 text-sm space-y-2">
                <div className="flex justify-between text-neutral-600">
                  <span>{isRtl ? product.nameAr : product.name} ({quantity}x)</span>
                  <span className="font-semibold">{subtotal} {t.common.currency}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>{t.cart.delivery}</span>
                  <span className="font-semibold">{isFree ? t.cart.freeDelivery : `${fee} ${t.common.currency}`}</span>
                </div>
                <div className="border-t border-neutral-200 pt-2 flex justify-between font-bold text-neutral-900">
                  <span>{t.cart.total}</span>
                  <span className="text-gold text-lg">{total} {t.common.currency}</span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowInstantBuy(false)}
                  className="flex-1 border border-neutral-300 py-3 rounded-xl font-semibold text-neutral-700 hover:bg-neutral-100 transition-colors text-sm cursor-pointer"
                >
                  {t.common.back}
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gold-gradient text-black py-3 rounded-xl font-bold hover:bg-gold-gradient-dark transition-all duration-200 shadow-gold text-sm inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{t.products.buyNow}</span>
                </button>
              </div>
            </form>
          ) : (
            /* Product Quick View */
            <>
              {/* Product Image */}
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-neutral-100 shadow-inner border border-neutral-200">
                <Image
                  src={product.image}
                  alt={isRtl ? product.nameAr : product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 480px"
                  className="object-cover"
                />
                <span className="absolute top-3.5 right-3.5 bg-black/80 backdrop-blur-xs text-gold px-3 py-1 text-xs font-bold rounded-full border border-gold/30">
                  {isRtl ? product.categoryAr : product.category}
                </span>
              </div>

              {/* Price & Title */}
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-neutral-900 mb-2">
                  {isRtl ? product.nameAr : product.name}
                </h1>
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl md:text-3xl font-black text-gold">
                    {product.price} {t.common.currency}
                  </span>
                  {product.originalPrice && (
                    <span className="text-neutral-400 line-through text-base">
                      {product.originalPrice} {t.common.currency}
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                  {t.products.description}
                </h3>
                <p className="text-sm text-neutral-700 leading-relaxed">
                  {isRtl ? product.descriptionAr : product.description}
                </p>
              </div>

              {/* Quantity Picker */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                  {t.products.quantity}
                </h3>
                <div className="flex items-center gap-4">
                  <div className="inline-flex items-center border border-neutral-300 rounded-xl bg-neutral-50 p-1">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      aria-label="Decrease quantity"
                      className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-white text-neutral-700 disabled:opacity-30 transition-colors cursor-pointer"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-bold text-base text-neutral-900">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(product.inStock, q + 1))}
                      disabled={quantity >= product.inStock}
                      aria-label="Increase quantity"
                      className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-white text-neutral-700 disabled:opacity-30 transition-colors cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-xs text-neutral-500">
                    {t.common.inStock} ({product.inStock} {t.common.items})
                  </span>
                </div>
              </div>

              {/* Feature Highlights */}
              <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-neutral-600">
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-neutral-50 border border-neutral-100">
                  <Truck className="w-4 h-4 text-gold shrink-0" />
                  <span>{isRtl ? 'توصيل سريع 24-48 ساعة' : 'Livraison rapide 24/48h'}</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-neutral-50 border border-neutral-100">
                  <ShieldCheck className="w-4 h-4 text-gold shrink-0" />
                  <span>{isRtl ? 'الدفع نقداً عند المعاينة' : 'Paiement à la livraison'}</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        {!showInstantBuy && (
          <div className="p-5 border-t border-neutral-100 bg-neutral-50/70 space-y-2.5">
            <button
              type="button"
              onClick={handleAddToCart}
              className="w-full bg-black text-white py-3.5 rounded-xl font-bold hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 shadow-sm text-sm cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-gold" />
              <span>{t.products.addToCart}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowInstantBuy(true)}
              className="w-full bg-gold-gradient text-black py-3.5 rounded-xl font-bold hover:bg-gold-gradient-dark transition-all duration-200 shadow-gold flex items-center justify-center gap-2 text-sm cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{t.products.buyNow}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
