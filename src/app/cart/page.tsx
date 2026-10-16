'use client'

import { useCart } from '@/context/CartContext'
import { useLanguage } from '@/context/LanguageContext'
import Link from 'next/link'
import Image from 'next/image'
import { calculateDelivery } from '@/lib/constants'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, cartTotal } = useCart()
  const { t, isRtl } = useLanguage()

  const { fee, isFree } = calculateDelivery(cartTotal)
  const finalTotal = cartTotal + fee

  if (cart.length === 0) {
    return (
      <div className="py-20 md:py-32">
        <div className="container mx-auto px-4 text-center max-w-md">
          <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6 text-neutral-400">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-neutral-900 mb-2">
            {t.cart.emptyTitle}
          </h1>
          <p className="text-neutral-500 text-sm mb-8">
            {t.cart.emptyDesc}
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-gold-gradient text-black px-8 py-3.5 rounded-xl font-bold hover:bg-gold-gradient-dark transition-all duration-200 shadow-gold text-sm cursor-pointer"
          >
            <span>{t.cart.continueShopping}</span>
            {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </Link>
        </div>
      </div>
    )
  }

  const handleRemove = (id: number) => {
    removeFromCart(id)
    toast.info(t.toasts.removedFromCart)
  }

  return (
    <div className="py-8 md:py-16 bg-neutral-50/50 min-h-[75vh]">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-2xl md:text-4xl font-black text-neutral-900 mb-8 tracking-tight">
          {t.cart.title}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-sm border border-neutral-200/80 p-4 md:p-5 flex gap-4 md:gap-6 hover:shadow-md transition-shadow items-center"
              >
                {/* Product Thumbnail */}
                <div className="relative w-24 h-24 md:w-28 md:h-28 bg-neutral-100 rounded-xl overflow-hidden shrink-0 border border-neutral-200">
                  <Image
                    src={item.image}
                    alt={isRtl ? item.nameAr : item.name}
                    fill
                    sizes="(max-width: 768px) 96px, 112px"
                    className="object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-neutral-900 text-base md:text-lg mb-1 truncate">
                    {isRtl ? item.nameAr : item.name}
                  </h3>
                  <p className="text-gold font-bold text-base md:text-lg mb-3">
                    {item.price} {t.common.currency}
                  </p>

                  <div className="flex flex-wrap items-center gap-4">
                    {/* Quantity Picker */}
                    <div className="inline-flex items-center border border-neutral-300 rounded-lg bg-neutral-50 p-0.5">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        aria-label="Decrease quantity"
                        className="w-8 h-8 rounded flex items-center justify-center text-neutral-600 hover:text-black hover:bg-white transition-colors cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-9 text-center font-bold text-sm text-neutral-900">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        aria-label="Increase quantity"
                        className="w-8 h-8 rounded flex items-center justify-center text-neutral-600 hover:text-black hover:bg-white transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemove(item.id)}
                      className="inline-flex items-center gap-1 text-red-500 hover:text-red-700 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{t.cart.remove}</span>
                    </button>
                  </div>
                </div>

                {/* Subtotal */}
                <div className="text-right shrink-0">
                  <p className="font-black text-lg md:text-xl text-neutral-900">
                    {item.price * item.quantity} {t.common.currency}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary Box */}
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-200/80 p-6 h-fit space-y-6">
            <h2 className="text-lg font-bold text-neutral-900 border-b border-neutral-100 pb-3">
              {t.checkout.orderSummary}
            </h2>

            <div className="space-y-3 text-sm">
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

            <div className="space-y-3 pt-2">
              <Link
                href="/checkout"
                className="w-full bg-gold-gradient text-black py-4 rounded-xl font-bold hover:bg-gold-gradient-dark transition-all duration-200 shadow-gold text-base flex items-center justify-center gap-2 text-center cursor-pointer"
              >
                <span>{t.cart.checkout}</span>
                {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </Link>

              <Link
                href="/products"
                className="w-full border border-neutral-300 hover:bg-neutral-100 text-neutral-700 py-3 rounded-xl font-semibold transition-colors text-xs flex items-center justify-center text-center cursor-pointer"
              >
                {t.cart.continueShopping}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
