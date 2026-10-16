'use client'

import { useState, useEffect, useMemo } from 'react'
import { DbOrder, OrderStatus } from '@/types/order'
import {
  getOrdersAction,
  updateOrderStatusAction,
  verifyAdminPasscodeAction,
} from '@/app/actions/orders'
import {
  ShoppingBag,
  TrendingUp,
  Clock,
  CheckCircle2,
  Phone,
  MessageCircle,
  MapPin,
  Lock,
  Search,
  RefreshCw,
  SlidersHorizontal,
  Database,
  Calendar,
} from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window === 'undefined') return false
    try {
      return sessionStorage.getItem('medshop_admin_auth') === 'true'
    } catch {
      return false
    }
  })
  const [passcode, setPasscode] = useState('')
  const [authError, setAuthError] = useState(false)

  const [orders, setOrders] = useState<DbOrder[]>([])
  const [isLiveDb, setIsLiveDb] = useState(false)
  const [loading, setLoading] = useState(false)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const res = await getOrdersAction()
      if (res.success) {
        setOrders(res.orders)
        setIsLiveDb(res.isLiveDb)
      }
    } catch {
      toast.error('Erreur lors du chargement des commandes')
    } finally {
      setLoading(false)
    }
  }

  // Load orders when authenticated
  useEffect(() => {
    if (!isAuthenticated) return
    let ignore = false
    getOrdersAction().then((res) => {
      if (!ignore && res.success) {
        setOrders(res.orders)
        setIsLiveDb(res.isLiveDb)
      }
    })
    return () => {
      ignore = true
    }
  }, [isAuthenticated])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError(false)
    const isValid = await verifyAdminPasscodeAction(passcode)
    if (isValid) {
      setIsAuthenticated(true)
      sessionStorage.setItem('medshop_admin_auth', 'true')
      toast.success('Connexion administrateur réussie')
    } else {
      setAuthError(true)
      toast.error('Code d’accès incorrect')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    sessionStorage.removeItem('medshop_admin_auth')
    setPasscode('')
  }

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingId(orderId)
    const res = await updateOrderStatusAction(orderId, newStatus)
    setUpdatingId(null)

    if (res.success) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      )
      toast.success('Statut de la commande mis à jour')
    } else {
      toast.error(res.error || 'Erreur lors de la mise à jour')
    }
  }

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer_phone.includes(searchQuery) ||
        order.customer_city.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = statusFilter === 'all' || order.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [orders, searchQuery, statusFilter])

  // Key Metrics
  const metrics = useMemo(() => {
    const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0)
    const pendingCount = orders.filter((o) => o.status === 'pending').length
    const deliveredCount = orders.filter((o) => o.status === 'delivered').length

    return {
      totalRevenue,
      totalOrders: orders.length,
      pendingCount,
      deliveredCount,
    }
  }, [orders])

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-100 text-amber-800 border-amber-300'
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'shipped':
        return 'bg-purple-100 text-purple-800 border-purple-300'
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-300'
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-300'
      default:
        return 'bg-neutral-100 text-neutral-800 border-neutral-300'
    }
  }

  const getStatusLabel = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 'En attente'
      case 'confirmed':
        return 'Confirmée'
      case 'shipped':
        return 'Expédiée'
      case 'delivered':
        return 'Livrée'
      case 'cancelled':
        return 'Annulée'
      default:
        return status
    }
  }

  // If NOT Authenticated, show login card
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4 bg-neutral-950 text-white">
        <div className="max-w-md w-full bg-neutral-900 border border-neutral-800 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gold/10 border border-gold/30 text-gold flex items-center justify-center mx-auto mb-3 shadow-gold">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-black text-gold">Espace Administration</h1>
            <p className="text-xs text-neutral-400">
              Veuillez saisir votre code d’accès pour gérer les commandes Med Shop.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
                Code d’accès Secret
              </label>
              <input
                type="password"
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Code admin (défaut: medshop2026)"
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold transition-colors font-mono"
              />
              {authError && (
                <p className="text-xs text-red-400 mt-2 font-medium">
                  Code incorrect. Veuillez réessayer.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-gold-gradient text-black py-3.5 rounded-xl font-bold hover:bg-gold-gradient-dark transition-all duration-200 shadow-gold text-sm cursor-pointer"
            >
              Déverrouiller le Tableau de Bord
            </button>
          </form>

          <div className="pt-4 border-t border-neutral-800/80 text-center">
            <Link
              href="/"
              className="text-xs text-neutral-400 hover:text-gold transition-colors"
            >
              ← Retour au site public
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Authenticated Admin Dashboard
  return (
    <div className="min-h-screen bg-neutral-50/70 pb-20">
      {/* Top Admin Nav */}
      <div className="bg-black text-white border-b border-neutral-800 sticky top-0 z-30 shadow-md">
        <div className="container mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xl font-black text-gold tracking-wide">MED SHOP</span>
            <span className="text-xs font-bold bg-neutral-800 text-neutral-300 px-2.5 py-1 rounded-md">
              Dashboard Admin
            </span>

            {/* Supabase connection indicator */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-xs">
              <Database className="w-3.5 h-3.5 text-gold" />
              {isLiveDb ? (
                <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Supabase PostgreSQL Connecté
                </span>
              ) : (
                <span className="text-amber-400 font-medium flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  Mode Local (En attente des clés Supabase)
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={fetchOrders}
              disabled={loading}
              className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors cursor-pointer border border-neutral-800"
              title="Actualiser les commandes"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <Link
              href="/"
              target="_blank"
              className="text-xs font-bold text-neutral-300 hover:text-gold px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 transition-colors"
            >
              Voir le Site
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="text-xs font-bold text-red-400 hover:text-red-300 px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 hover:bg-red-950/40 transition-colors cursor-pointer"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl space-y-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/30 text-gold flex items-center justify-center shrink-0">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-neutral-500 font-bold uppercase tracking-wider">
                Chiffre d’Affaires
              </p>
              <p className="text-2xl font-black text-neutral-900">
                {metrics.totalRevenue} DH
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-neutral-100 border border-neutral-200 text-neutral-800 flex items-center justify-center shrink-0">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-neutral-500 font-bold uppercase tracking-wider">
                Total Commandes
              </p>
              <p className="text-2xl font-black text-neutral-900">
                {metrics.totalOrders}
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-neutral-500 font-bold uppercase tracking-wider">
                En Attente
              </p>
              <p className="text-2xl font-black text-amber-600">
                {metrics.pendingCount}
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-neutral-500 font-bold uppercase tracking-wider">
                Livrées
              </p>
              <p className="text-2xl font-black text-emerald-600">
                {metrics.deliveredCount}
              </p>
            </div>
          </div>
        </div>

        {/* Search & Status Filters */}
        <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            {/* Search Bar */}
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher par nom, téléphone, ville..."
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <span className="text-xs font-bold text-neutral-400 flex items-center gap-1 mr-1">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Filtre:
              </span>
              {[
                { key: 'all', label: 'Toutes' },
                { key: 'pending', label: 'En attente' },
                { key: 'confirmed', label: 'Confirmées' },
                { key: 'shipped', label: 'Expédiées' },
                { key: 'delivered', label: 'Livrées' },
                { key: 'cancelled', label: 'Annulées' },
              ].map((f) => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setStatusFilter(f.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    statusFilter === f.key
                      ? 'bg-black text-white shadow-xs'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
            <h2 className="text-base font-bold text-neutral-900">
              Liste des Commandes ({filteredOrders.length})
            </h2>
            <p className="text-xs text-neutral-500">
              Dernière synchronisation automatique
            </p>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="p-12 text-center text-neutral-500 space-y-2">
              <ShoppingBag className="w-10 h-10 mx-auto text-neutral-300" />
              <p className="text-sm font-semibold">Aucune commande trouvée</p>
              <p className="text-xs text-neutral-400">
                Les nouvelles commandes passées sur le site apparaîtront ici automatiquement.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {filteredOrders.map((order) => {
                const formattedDate = new Date(order.created_at).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })

                // WhatsApp clean number link for manager
                const cleanPhone = order.customer_phone.replace(/[\s.-]/g, '').replace(/^0/, '212')

                return (
                  <div key={order.id} className="p-5 hover:bg-neutral-50/70 transition-colors space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* Customer Info */}
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-bold text-neutral-900 text-base">
                            {order.customer_name}
                          </h3>
                          <span
                            className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadge(
                              order.status
                            )}`}
                          >
                            {getStatusLabel(order.status)}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-500">
                          <span className="flex items-center gap-1 text-neutral-700 font-semibold">
                            <MapPin className="w-3.5 h-3.5 text-gold shrink-0" />
                            {order.customer_city} ({order.customer_address})
                          </span>
                          <span className="flex items-center gap-1 font-mono">
                            <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                            {formattedDate}
                          </span>
                        </div>
                      </div>

                      {/* Actions: Direct WhatsApp & Call */}
                      <div className="flex items-center gap-2.5 self-start md:self-center">
                        <a
                          href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                            `Bonjour ${order.customer_name}, nous confirmons votre commande sur Med Shop.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>

                        <a
                          href={`tel:${order.customer_phone}`}
                          className="inline-flex items-center gap-1.5 bg-neutral-800 hover:bg-black text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>Appeler</span>
                        </a>

                        {/* Status Dropdown */}
                        <div className="relative">
                          <select
                            value={order.status}
                            disabled={updatingId === order.id}
                            onChange={(e) =>
                              handleStatusChange(order.id, e.target.value as OrderStatus)
                            }
                            className="bg-white border border-neutral-300 rounded-xl px-3 py-1.5 text-xs font-bold text-neutral-800 cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold"
                          >
                            <option value="pending">En attente</option>
                            <option value="confirmed">Confirmée</option>
                            <option value="shipped">Expédiée</option>
                            <option value="delivered">Livrée</option>
                            <option value="cancelled">Annulée</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Order Items & Total */}
                    <div className="bg-neutral-50 p-3.5 rounded-xl border border-neutral-200/80 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                      <div className="space-y-1">
                        <p className="font-bold text-neutral-700">Articles commandés :</p>
                        <div className="flex flex-wrap gap-2">
                          {order.items.map((item, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-neutral-200 text-neutral-800 font-medium"
                            >
                              <span className="font-bold text-gold">{item.quantity}x</span>{' '}
                              {item.name} ({item.price * item.quantity} DH)
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-neutral-500 mr-2">Total à encaisser :</span>
                        <span className="text-base font-black text-neutral-900">
                          {order.total} DH
                        </span>
                        <span className="text-[10px] text-neutral-400 block">
                          (Livraison: {order.delivery_fee === 0 ? 'Gratuite' : `${order.delivery_fee} DH`})
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
