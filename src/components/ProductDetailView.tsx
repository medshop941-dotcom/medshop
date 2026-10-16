'use client'

import { useLanguage } from '@/context/LanguageContext'
import { useCart } from '@/context/CartContext'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Product } from '@/types/product'
import {
  MOROCCAN_CITIES,
  generateWhatsAppOrderUrl,
  isValidMoroccanPhone,
  calculateDelivery,
} from '@/lib/constants'
import {
  ArrowLeft,
  ArrowRight,
  Plus,
  Minus,
  ShoppingBag,
  Send,
  ShieldCheck,
  Truck,
  CheckCircle2,
  PackageOpen,
} from 'lucide-react'
import { toast } from 'sonner'
import { saveOrderAction } from '@/app/actions/orders'

export function ProductDetailView({ product }: { product?: Product }) {
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

  if (!product) {
    return (
      <div className="py-24 text-center">
        <div className="container mx-auto px-4 max-w-md">
          <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4 text-neutral-400">
            <PackageOpen className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">
            {t.products.productNotFound}
          </h1>
          <p className="text-neutral-500 text-sm mb-6">
            {t.products.productNotFoundDesc}
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl font-bold hover:bg-neutral-800 transition-colors text-sm"
          >
            {isRtl ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            <span>{t.products.backToProducts}</span>
          </Link>
        </div>
      </div>
    )
  }

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
        : `"${product.name}" (${quantity}) ajouté au panier avec succès !`
    )
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

    // Record order in database
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
    setShowInstantBuy(false)
  }

  const subtotal = product.price * quantity
  const { fee, isFree } = calculateDelivery(subtotal)
  const total = subtotal + fee

  return (
    <div className="py-8 md:py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Back Link */}
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-neutral-600 hover:text-black mb-6 md:mb-8 text-sm font-semibold transition-colors"
        >
          {isRtl ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          <span>{t.products.backToProducts}</span>
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 items-start">
          {/* Product Image */}
          <div className="relative aspect-square w-full bg-neutral-100 rounded-3xl overflow-hidden shadow-lg border border-neutral-200">
            <Image
              src={product.image}
              alt={isRtl ? product.nameAr : product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
              className="object-cover"
            />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <span className="inline-block bg-black text-gold px-3.5 py-1 text-xs font-bold rounded-full mb-3 border border-gold/30">
                {isRtl ? product.categoryAr : product.category}
              </span>

              <h1 className="text-2xl md:text-4xl font-black text-neutral-900 tracking-tight leading-snug">
                {isRtl ? product.nameAr : product.name}
              </h1>

              <div className="flex items-baseline gap-3 mt-3">
                <span className="text-3xl md:text-4xl font-black text-gold">
                  {product.price} {t.common.currency}
                </span>
                {product.originalPrice && (
                  <span className="text-neutral-400 line-through text-lg">
                    {product.originalPrice} {t.common.currency}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="border-t border-b border-neutral-200 py-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
                {t.products.description}
              </h2>
              <p className="text-neutral-700 text-sm md:text-base leading-relaxed">
                {isRtl ? product.descriptionAr : product.description}
              </p>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                {t.products.quantity}
              </h2>
              <div className="flex items-center gap-4">
                <div className="inline-flex items-center border border-neutral-300 rounded-xl bg-neutral-50 p-1">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                    className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-white text-neutral-700 disabled:opacity-30 transition-colors cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-bold text-lg text-neutral-900">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(product.inStock, q + 1))}
                    disabled={quantity >= product.inStock}
                    aria-label="Increase quantity"
                    className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-white text-neutral-700 disabled:opacity-30 transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-neutral-600">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>
                    {t.common.inStock} ({product.inStock} {t.common.items})
                  </span>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-neutral-800 transition-colors text-base flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <ShoppingBag className="w-5 h-5 text-gold" />
                <span>{t.products.addToCart}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowInstantBuy(true)}
                className="w-full bg-gold-gradient text-black py-4 rounded-xl font-bold hover:bg-gold-gradient-dark transition-all duration-200 text-base flex items-center justify-center gap-2 shadow-gold cursor-pointer"
              >
                <Send className="w-5 h-5" />
                <span>{t.products.buyNow}</span>
              </button>
            </div>

            {/* Delivery & Warranty info */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-neutral-200 text-xs text-neutral-600">
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-neutral-50 border border-neutral-100">
                <Truck className="w-4 h-4 text-gold shrink-0" />
                <span>{isRtl ? 'توصيل بالمجان ابتداءً من 500 درهم' : 'Livraison gratuite dès 500 DH'}</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-neutral-50 border border-neutral-100">
                <ShieldCheck className="w-4 h-4 text-gold shrink-0" />
                <span>{isRtl ? 'الدفع نقداً بعد فحص المنتج' : 'Paiement à la réception'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Instant Buy Modal Dialog */}
        {showInstantBuy && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4"
            role="dialog"
            aria-modal="true"
          >
            <div className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-neutral-900">
                  {t.products.instantBuyTitle}
                </h2>
                <button
                  type="button"
                  onClick={() => setShowInstantBuy(false)}
                  className="p-1.5 text-neutral-400 hover:text-black rounded-lg hover:bg-neutral-100"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-neutral-500 mb-4">
                {t.products.instantBuyDesc}
              </p>

              {errorMessage && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleInstantBuy} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
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
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
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
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
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
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
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

                {/* Price breakdown */}
                <div className="bg-neutral-50 p-3.5 rounded-xl border border-neutral-200 text-xs space-y-1.5">
                  <div className="flex justify-between text-neutral-600">
                    <span>
                      {isRtl ? product.nameAr : product.name} ({quantity}x)
                    </span>
                    <span className="font-semibold">
                      {subtotal} {t.common.currency}
                    </span>
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span>{t.cart.delivery}</span>
                    <span className="font-semibold">
                      {isFree ? t.cart.freeDelivery : `${fee} ${t.common.currency}`}
                    </span>
                  </div>
                  <div className="border-t border-neutral-200 pt-2 flex justify-between font-bold text-neutral-900 text-sm">
                    <span>{t.cart.total}</span>
                    <span className="text-gold">
                      {total} {t.common.currency}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowInstantBuy(false)}
                    className="flex-1 border border-neutral-300 py-3 rounded-xl font-semibold text-neutral-700 hover:bg-neutral-100 transition-colors text-sm cursor-pointer"
                  >
                    {t.common.cancel}
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
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
