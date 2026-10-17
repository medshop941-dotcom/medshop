'use client'

import { useState, useEffect, useMemo, FormEvent } from 'react'
import { DbOrder, OrderStatus } from '@/types/order'
import { Product } from '@/types/product'
import {
  getOrdersAction,
  updateOrderStatusAction,
  verifyAdminPasscodeAction,
} from '@/app/actions/orders'
import {
  fetchCatalogProductsAction,
  createProductAction,
  updateProductAction,
  deleteProductAction,
} from '@/app/actions/products'
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
  Plus,
  Trash2,
  Edit3,
  Star,
  Tag,
  Boxes,
  Sparkles,
  X,
  ExternalLink,
  ImageIcon,
  Check,
} from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import Image from 'next/image'

// Curated high-resolution luxury product image presets for instant 1-click photo selection
const LUXURY_IMAGE_PRESETS = [
  {
    name: 'Sac Noir Cuir Élite',
    url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Sac Doré Soirée Royale',
    url: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Collier Or & Perle Blanche',
    url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Bague Solitaire Émeraude',
    url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Montre Dorée Luxe Cadran Nacre',
    url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Bracelet Manchette Doré',
    url: 'https://images.unsplash.com/photo-1611591475155-426c04385a67?auto=format&fit=crop&w=800&q=80',
  },
]

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

  // Active Tab: 'orders' or 'products'
  const [activeTab, setActiveTab] = useState<'orders' | 'products'>('orders')

  // Orders State
  const [orders, setOrders] = useState<DbOrder[]>([])
  const [isLiveDb, setIsLiveDb] = useState(false)
  const [loadingOrders, setLoadingOrders] = useState(false)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  // Products CMS State
  const [products, setProducts] = useState<Product[]>([])
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [productSearch, setProductSearch] = useState('')
  const [productCategoryFilter, setProductCategoryFilter] = useState('all')

  // Product Add / Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isSavingProduct, setIsSavingProduct] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    nameAr: '',
    category: 'Sacs à Main',
    categoryAr: 'حقائب يد',
    price: 390,
    originalPrice: 490,
    inStock: 10,
    image: '/logo.jpg',
    featured: true,
    description: '',
    descriptionAr: '',
  })

  // Load Data when authenticated
  const fetchOrders = async () => {
    setLoadingOrders(true)
    try {
      const res = await getOrdersAction()
      if (res.success) {
        setOrders(res.orders)
        setIsLiveDb(res.isLiveDb)
      }
    } catch {
      toast.error('Erreur lors du chargement des commandes')
    } finally {
      setLoadingOrders(false)
    }
  }

  const fetchProducts = async () => {
    setLoadingProducts(true)
    try {
      const data = await fetchCatalogProductsAction()
      setProducts(data)
    } catch {
      toast.error('Erreur lors du chargement des produits')
    } finally {
      setLoadingProducts(false)
    }
  }

  useEffect(() => {
    if (!isAuthenticated) return
    fetchOrders()
    fetchProducts()
  }, [isAuthenticated])

  const handleLogin = async (e: FormEvent) => {
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

  // --- Orders Handlers ---
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

  // --- Products CMS Handlers ---
  const handleOpenAddModal = () => {
    setEditingProduct(null)
    setFormData({
      name: '',
      nameAr: '',
      category: 'Sacs à Main',
      categoryAr: 'حقائب يد',
      price: 390,
      originalPrice: 490,
      inStock: 10,
      image: LUXURY_IMAGE_PRESETS[0].url,
      featured: true,
      description: 'Pièce raffinée confectionnée avec des matériaux d’exception.',
      descriptionAr: 'قطعة أنيقة مصممة بعناية فائقة وتفاصيل راقية تناسب كل المناسبات.',
    })
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      nameAr: product.nameAr,
      category: product.category,
      categoryAr: product.categoryAr,
      price: product.price,
      originalPrice: product.originalPrice ?? (product.price + 100),
      inStock: product.inStock,
      image: product.image,
      featured: Boolean(product.featured),
      description: product.description,
      descriptionAr: product.descriptionAr,
    })
    setIsModalOpen(true)
  }

  const handleSaveProduct = async (e: FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.nameAr.trim()) {
      toast.error('Veuillez renseigner le nom en français et en arabe')
      return
    }

    setIsSavingProduct(true)
    try {
      if (editingProduct) {
        // Update product
        const res = await updateProductAction(editingProduct.id, {
          name: formData.name,
          nameAr: formData.nameAr,
          category: formData.category,
          categoryAr: formData.categoryAr,
          price: Number(formData.price),
          originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
          inStock: Number(formData.inStock),
          image: formData.image || '/logo.jpg',
          featured: formData.featured,
          description: formData.description,
          descriptionAr: formData.descriptionAr,
        })

        if (res.success && res.product) {
          setProducts((prev) =>
            prev.map((p) => (p.id === editingProduct.id ? res.product! : p))
          )
          toast.success('Produit modifié avec succès !')
          setIsModalOpen(false)
        } else {
          toast.error(res.error || 'Erreur lors de la modification')
        }
      } else {
        // Create product
        const res = await createProductAction({
          name: formData.name,
          nameAr: formData.nameAr,
          category: formData.category,
          categoryAr: formData.categoryAr,
          price: Number(formData.price),
          originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
          inStock: Number(formData.inStock),
          image: formData.image || '/logo.jpg',
          featured: formData.featured,
          description: formData.description,
          descriptionAr: formData.descriptionAr,
        })

        if (res.success && res.product) {
          setProducts((prev) => [res.product!, ...prev])
          toast.success('Nouveau produit publié dans la boutique !')
          setIsModalOpen(false)
        } else {
          toast.error(res.error || 'Erreur lors de la création')
        }
      }
    } catch {
      toast.error('Une erreur inattendue est survenue')
    } finally {
      setIsSavingProduct(false)
    }
  }

  const handleDeleteProduct = async (id: number | string, name: string) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer "${name}" ?`)) return

    try {
      const res = await deleteProductAction(id)
      if (res.success) {
        setProducts((prev) => prev.filter((p) => p.id !== id))
        toast.success(`"${name}" a été supprimé`)
      } else {
        toast.error(res.error || 'Erreur lors de la suppression')
      }
    } catch {
      toast.error('Erreur lors de la suppression')
    }
  }

  const handleToggleFeatured = async (product: Product) => {
    const nextVal = !product.featured
    // Optimistic
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, featured: nextVal } : p))
    )

    const res = await updateProductAction(product.id, { featured: nextVal })
    if (res.success) {
      toast.success(
        nextVal
          ? `"${product.name}" est maintenant en vedette sur l’accueil`
          : `"${product.name}" retiré des vedettes`
      )
    } else {
      // Revert
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, featured: product.featured } : p))
      )
      toast.error('Impossible de modifier le statut en vedette')
    }
  }

  // Filtered Orders
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

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesQuery =
        product.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        product.nameAr.includes(productSearch) ||
        product.category.toLowerCase().includes(productSearch.toLowerCase())

      const matchesCat =
        productCategoryFilter === 'all' || product.category === productCategoryFilter

      return matchesQuery && matchesCat
    })
  }, [products, productSearch, productCategoryFilter])

  // Distinct Categories list
  const productCategories = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.category).filter(Boolean)))
  }, [products])

  // Metrics
  const orderMetrics = useMemo(() => {
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

  const productMetrics = useMemo(() => {
    const featuredCount = products.filter((p) => p.featured).length
    const totalStock = products.reduce((sum, p) => sum + (Number(p.inStock) || 0), 0)
    return {
      totalProducts: products.length,
      featuredCount,
      totalStock,
      categoryCount: productCategories.length,
    }
  }, [products, productCategories])

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
      <div className="min-h-[85vh] flex items-center justify-center p-4 bg-neutral-950 text-white">
        <div className="max-w-md w-full bg-neutral-900 border border-neutral-800 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gold/10 border border-gold/30 text-gold mb-2 shadow-inner">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">
              Espace Administrateur
            </h1>
            <p className="text-xs text-neutral-400">
              MED SHOP Maroc — Commandes & Gestion de Catalogue
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="admin-passcode"
                className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2"
              >
                Code Secret d’Accès
              </label>
              <input
                id="admin-passcode"
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Entrez votre mot de passe admin"
                className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-gold transition-colors text-sm"
                required
              />
              {authError && (
                <p className="text-red-400 text-xs mt-2 font-medium">
                  Mot de passe invalide. Veuillez réessayer.
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
        <div className="container mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
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
                  Supabase Live
                </span>
              ) : (
                <span className="text-amber-400 font-medium flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  Mode Local
                </span>
              )}
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center bg-neutral-900 p-1 rounded-xl border border-neutral-800">
            <button
              type="button"
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-gold text-black shadow-xs'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Commandes ({orders.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('products')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'products'
                  ? 'bg-gold text-black shadow-xs'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Catalogue CMS ({products.length})</span>
            </button>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => {
                fetchOrders()
                fetchProducts()
              }}
              disabled={loadingOrders || loadingProducts}
              className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors cursor-pointer border border-neutral-800"
              title="Actualiser les données"
            >
              <RefreshCw
                className={`w-4 h-4 ${
                  loadingOrders || loadingProducts ? 'animate-spin' : ''
                }`}
              />
            </button>

            <Link
              href="/"
              target="_blank"
              className="text-xs font-bold text-neutral-300 hover:text-gold px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 transition-colors flex items-center gap-1.5"
            >
              <span>Voir le Site</span>
              <ExternalLink className="w-3 h-3" />
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
        {/* ========================================================================= */}
        {/* TAB 1: ORDERS MANAGEMENT */}
        {/* ========================================================================= */}
        {activeTab === 'orders' && (
          <>
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
                    {orderMetrics.totalRevenue} DH
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
                    {orderMetrics.totalOrders}
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
                    {orderMetrics.pendingCount}
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
                    {orderMetrics.deliveredCount}
                  </p>
                </div>
              </div>
            </div>

            {/* Search & Status Filters */}
            <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher par nom client, téléphone ou ville..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50/50 text-sm focus:outline-none focus:border-gold transition-colors"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
                <SlidersHorizontal className="w-4 h-4 text-neutral-400 shrink-0" />
                {(
                  [
                    { key: 'all', label: 'Toutes' },
                    { key: 'pending', label: 'En attente' },
                    { key: 'confirmed', label: 'Confirmées' },
                    { key: 'shipped', label: 'Expédiées' },
                    { key: 'delivered', label: 'Livrées' },
                    { key: 'cancelled', label: 'Annulées' },
                  ] as const
                ).map((s) => (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => setStatusFilter(s.key)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                      statusFilter === s.key
                        ? 'bg-black text-gold shadow-xs'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders Feed */}
            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-neutral-200/80 shadow-xs space-y-3">
                <ShoppingBag className="w-12 h-12 text-neutral-300 mx-auto" />
                <h3 className="text-lg font-bold text-neutral-800">Aucune commande trouvée</h3>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                  {searchQuery || statusFilter !== 'all'
                    ? 'Aucun résultat ne correspond à vos critères de recherche.'
                    : 'Les nouvelles commandes passées par vos clients apparaîtront ici automatiquement.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredOrders.map((order) => {
                  const rawPhone = order.customer_phone.replace(/\D/g, '')
                  const waNumber = rawPhone.startsWith('0')
                    ? `212${rawPhone.slice(1)}`
                    : rawPhone.startsWith('212')
                    ? rawPhone
                    : `212${rawPhone}`

                  const waMessage = encodeURIComponent(
                    `Bonjour ${order.customer_name}, c'est MED SHOP concernant votre commande N° ${order.id.slice(
                      0,
                      8
                    )} (${order.total} DH).`
                  )

                  return (
                    <div
                      key={order.id}
                      className="bg-white rounded-2xl border border-neutral-200/90 shadow-xs p-5 md:p-6 transition-all hover:border-neutral-300 hover:shadow-md"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-xs font-bold text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded">
                              #{order.id.slice(0, 8)}
                            </span>
                            <span
                              className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadge(
                                order.status
                              )}`}
                            >
                              {getStatusLabel(order.status)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-neutral-500">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>
                              {new Date(order.created_at).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                        </div>

                        {/* Status Switcher & Contact Actions */}
                        <div className="flex flex-wrap items-center gap-2">
                          <select
                            value={order.status}
                            disabled={updatingId === order.id}
                            onChange={(e) =>
                              handleStatusChange(order.id, e.target.value as OrderStatus)
                            }
                            className="bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-bold text-neutral-800 focus:outline-none focus:border-gold transition-colors cursor-pointer"
                          >
                            <option value="pending">⏳ En attente</option>
                            <option value="confirmed">✅ Confirmée</option>
                            <option value="shipped">🚚 Expédiée</option>
                            <option value="delivered">📦 Livrée</option>
                            <option value="cancelled">❌ Annulée</option>
                          </select>

                          <a
                            href={`https://wa.me/${waNumber}?text=${waMessage}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </a>

                          <a
                            href={`tel:${order.customer_phone}`}
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-900 hover:bg-black text-white font-bold text-xs transition-colors cursor-pointer"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>Appeler</span>
                          </a>
                        </div>
                      </div>

                      {/* Customer & Items Details */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                        {/* Customer Info */}
                        <div className="space-y-1.5 text-xs">
                          <p className="font-bold text-neutral-900 text-sm">
                            {order.customer_name}
                          </p>
                          <p className="text-neutral-600 flex items-center gap-1.5">
                            <Phone className="w-3 h-3 text-neutral-400" />
                            {order.customer_phone}
                          </p>
                          <p className="text-neutral-600 flex items-start gap-1.5">
                            <MapPin className="w-3 h-3 text-neutral-400 shrink-0 mt-0.5" />
                            <span>
                              {order.customer_address}, <strong className="text-neutral-800">{order.customer_city}</strong>
                            </span>
                          </p>
                          {order.notes && (
                            <p className="text-neutral-500 italic bg-neutral-50 p-2 rounded-lg mt-2 border border-neutral-200/60">
                              Note: {order.notes}
                            </p>
                          )}
                        </div>

                        {/* Order Items */}
                        <div className="md:col-span-2 space-y-2">
                          <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
                            Articles Commandés ({order.items.reduce((sum, i) => sum + i.quantity, 0)})
                          </p>
                          <div className="divide-y divide-neutral-100 bg-neutral-50/50 rounded-xl p-3 border border-neutral-100">
                            {order.items.map((item, idx) => (
                              <div
                                key={idx}
                                className="py-2 first:pt-0 last:pb-0 flex items-center justify-between text-xs"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-lg overflow-hidden relative bg-neutral-200 shrink-0">
                                    <Image
                                      src={item.image || '/logo.jpg'}
                                      alt={item.name}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                  <div>
                                    <p className="font-bold text-neutral-900">{item.name}</p>
                                    <p className="text-neutral-500 text-[11px]">
                                      {item.quantity} × {item.price} DH
                                    </p>
                                  </div>
                                </div>
                                <span className="font-bold text-neutral-900">
                                  {item.price * item.quantity} DH
                                </span>
                              </div>
                            ))}
                          </div>

                          <div className="flex items-center justify-between pt-2 px-1 text-xs font-bold">
                            <span className="text-neutral-500">
                              Livraison:{' '}
                              {order.delivery_fee === 0 ? (
                                <span className="text-emerald-600">Gratuite</span>
                              ) : (
                                `${order.delivery_fee} DH`
                              )}
                            </span>
                            <span className="text-sm text-neutral-900">
                              Total: <span className="text-gold font-black">{order.total} DH</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: PRODUCTS CMS */}
        {/* ========================================================================= */}
        {activeTab === 'products' && (
          <>
            {/* Products KPI Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/30 text-gold flex items-center justify-center shrink-0">
                  <Boxes className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-neutral-500 font-bold uppercase tracking-wider">
                    Total Articles
                  </p>
                  <p className="text-2xl font-black text-neutral-900">
                    {productMetrics.totalProducts}
                  </p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-amber-500 flex items-center justify-center shrink-0">
                  <Star className="w-6 h-6 fill-amber-400" />
                </div>
                <div>
                  <p className="text-xs text-neutral-500 font-bold uppercase tracking-wider">
                    En Vedette (Accueil)
                  </p>
                  <p className="text-2xl font-black text-neutral-900">
                    {productMetrics.featuredCount}
                  </p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-neutral-500 font-bold uppercase tracking-wider">
                    Stock Global
                  </p>
                  <p className="text-2xl font-black text-neutral-900">
                    {productMetrics.totalStock} unités
                  </p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center shrink-0">
                  <Tag className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-neutral-500 font-bold uppercase tracking-wider">
                    Catégories Actives
                  </p>
                  <p className="text-2xl font-black text-neutral-900">
                    {productMetrics.categoryCount}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions & Filters */}
            <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Rechercher par nom de produit ou catégorie..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50/50 text-sm focus:outline-none focus:border-gold transition-colors"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value)}
                  className="px-3 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50/50 text-xs font-bold text-neutral-700 focus:outline-none focus:border-gold cursor-pointer"
                >
                  <option value="all">Toutes les catégories</option>
                  {productCategories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={handleOpenAddModal}
                  className="inline-flex items-center gap-2 bg-gold-gradient text-black px-4 py-2.5 rounded-xl font-bold text-xs hover:bg-gold-gradient-dark transition-all shadow-gold cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nouveau Produit</span>
                </button>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-neutral-200/80 shadow-xs space-y-3">
                <Boxes className="w-12 h-12 text-neutral-300 mx-auto" />
                <h3 className="text-lg font-bold text-neutral-800">Aucun produit trouvé</h3>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                  Cliquez sur &quot;Nouveau Produit&quot; pour ajouter vos sacs, bijoux ou montres.
                </p>
                <button
                  type="button"
                  onClick={handleOpenAddModal}
                  className="inline-flex items-center gap-2 bg-gold-gradient text-black px-5 py-2.5 rounded-xl font-bold text-xs shadow-gold cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Ajouter le premier produit</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((p) => {
                  const hasDiscount = p.originalPrice && p.originalPrice > p.price
                  const discountPct = hasDiscount
                    ? Math.round(((p.originalPrice! - p.price) / p.originalPrice!) * 100)
                    : 0

                  return (
                    <div
                      key={p.id}
                      className="bg-white rounded-2xl border border-neutral-200/90 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-all group"
                    >
                      {/* Product Top Image & Badges */}
                      <div className="relative aspect-4/3 w-full bg-neutral-100 overflow-hidden">
                        <Image
                          src={p.image || '/logo.jpg'}
                          alt={p.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />

                        {/* Top Action Badges */}
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                          <button
                            type="button"
                            onClick={() => handleToggleFeatured(p)}
                            title={
                              p.featured
                                ? 'En vedette sur l’accueil (Cliquer pour désactiver)'
                                : 'Mettre en vedette sur l’accueil'
                            }
                            className={`p-2 rounded-xl backdrop-blur-md shadow-md transition-all cursor-pointer ${
                              p.featured
                                ? 'bg-amber-400 text-black shadow-amber-400/30'
                                : 'bg-black/60 text-white/80 hover:text-white'
                            }`}
                          >
                            <Star
                              className={`w-4 h-4 ${p.featured ? 'fill-black' : ''}`}
                            />
                          </button>

                          <div className="flex items-center gap-1.5">
                            {hasDiscount && (
                              <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-sm">
                                -{discountPct}%
                              </span>
                            )}
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-md ${
                                p.inStock > 5
                                  ? 'bg-emerald-500/90 text-white'
                                  : p.inStock > 0
                                  ? 'bg-amber-500/90 text-white'
                                  : 'bg-red-500/90 text-white'
                              }`}
                            >
                              {p.inStock > 0 ? `${p.inStock} en stock` : 'Rupture'}
                            </span>
                          </div>
                        </div>

                        {/* Category pill */}
                        <div className="absolute bottom-3 left-3">
                          <span className="text-[11px] font-bold bg-black/75 backdrop-blur-md text-gold px-2.5 py-1 rounded-lg">
                            {p.category}
                          </span>
                        </div>
                      </div>

                      {/* Product Body */}
                      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-bold text-neutral-900 text-base line-clamp-1">
                              {p.name}
                            </h3>
                          </div>
                          <p className="text-xs text-neutral-500 font-arabic line-clamp-1 text-right mt-0.5" dir="rtl">
                            {p.nameAr}
                          </p>
                          <p className="text-xs text-neutral-600 line-clamp-2 mt-2 leading-relaxed">
                            {p.description}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                          <div className="flex items-baseline gap-2">
                            <span className="text-lg font-black text-neutral-950">
                              {p.price} DH
                            </span>
                            {hasDiscount && (
                              <span className="text-xs text-neutral-400 line-through">
                                {p.originalPrice} DH
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenEditModal(p)}
                              className="p-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors cursor-pointer"
                              title="Modifier ce produit"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteProduct(p.id, p.name)}
                              className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors cursor-pointer"
                              title="Supprimer ce produit"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}
      </div>

      {/* ========================================================================= */}
      {/* PRODUCT ADD / EDIT MODAL */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-neutral-200">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-neutral-100 px-6 py-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-gold" />
                <h2 className="text-lg font-black text-neutral-900">
                  {editingProduct ? 'Modifier le Produit' : 'Ajouter un Nouveau Produit'}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveProduct} className="p-6 space-y-6">
              {/* Product Titles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                    Nom du Produit (Français) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="ex: Sac à Main Cuir Royal"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5 text-right font-arabic" dir="rtl">
                    اسم المنتج (بالعربية) *
                  </label>
                  <input
                    type="text"
                    required
                    dir="rtl"
                    value={formData.nameAr}
                    onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                    placeholder="مثال: حقيبة يد ملكية فاخرة"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-gold font-arabic text-right"
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                    Catégorie (Français)
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-gold bg-white cursor-pointer"
                  >
                    <option value="Sacs à Main">Sacs à Main</option>
                    <option value="Sacs de Luxe">Sacs de Luxe</option>
                    <option value="Bijoux & Parures">Bijoux & Parures</option>
                    <option value="Montres & Accessoires">Montres & Accessoires</option>
                    <option value="Pochettes">Pochettes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5 text-right font-arabic" dir="rtl">
                    الفئة (بالعربية)
                  </label>
                  <select
                    dir="rtl"
                    value={formData.categoryAr}
                    onChange={(e) => setFormData({ ...formData, categoryAr: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-gold bg-white cursor-pointer font-arabic text-right"
                  >
                    <option value="حقائب يد">حقائب يد</option>
                    <option value="حقائب فاخرة">حقائب فاخرة</option>
                    <option value="مجوهرات وحلي">مجوهرات وحلي</option>
                    <option value="ساعات وإكسسوارات">ساعات وإكسسوارات</option>
                    <option value="حقائب صغيرة">حقائب صغيرة</option>
                  </select>
                </div>
              </div>

              {/* Price, Original Price, Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                    Prix de Vente (DH) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-gold font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                    Prix Barré (DH)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.originalPrice || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, originalPrice: Number(e.target.value) })
                    }
                    placeholder="Optionnel"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                    Stock Disponible *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.inStock}
                    onChange={(e) =>
                      setFormData({ ...formData, inStock: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              {/* Image URL & Preset Selection */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider">
                  Photo Principale du Produit (URL)
                </label>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-xl bg-neutral-100 border border-neutral-200 overflow-hidden relative shrink-0">
                    <Image
                      src={formData.image || '/logo.jpg'}
                      alt="Aperçu photo"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://images.unsplash.com/... ou /logo.jpg"
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-gold"
                  />
                </div>

                {/* 1-Click Photo Presets */}
                <div className="pt-1">
                  <p className="text-[11px] text-neutral-500 font-semibold mb-2">
                    Photos de luxe prédéfinies (1-clic pour appliquer) :
                  </p>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {LUXURY_IMAGE_PRESETS.map((preset) => (
                      <button
                        key={preset.url}
                        type="button"
                        onClick={() => setFormData({ ...formData, image: preset.url })}
                        className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer group ${
                          formData.image === preset.url
                            ? 'border-gold ring-2 ring-gold/40'
                            : 'border-transparent hover:border-neutral-300'
                        }`}
                        title={preset.name}
                      >
                        <Image
                          src={preset.url}
                          alt={preset.name}
                          fill
                          className="object-cover"
                        />
                        {formData.image === preset.url && (
                          <div className="absolute inset-0 bg-gold/30 flex items-center justify-center">
                            <Check className="w-4 h-4 text-black drop-shadow" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Homepage Featured Toggle */}
              <div className="flex items-center gap-3 p-4 bg-amber-50/60 border border-amber-200/70 rounded-2xl">
                <input
                  id="featured-toggle"
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 text-gold accent-gold rounded cursor-pointer"
                />
                <label
                  htmlFor="featured-toggle"
                  className="text-xs font-bold text-neutral-800 cursor-pointer flex items-center gap-1.5"
                >
                  <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                  <span>Mettre en vedette sur la page d’accueil du site</span>
                </label>
              </div>

              {/* Descriptions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                    Description Détaillée (Français)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Détails sur la confection, matières, dimensions..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-gold leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5 text-right font-arabic" dir="rtl">
                    الوصف التفصيلي (بالعربية)
                  </label>
                  <textarea
                    rows={3}
                    dir="rtl"
                    value={formData.descriptionAr}
                    onChange={(e) =>
                      setFormData({ ...formData, descriptionAr: e.target.value })
                    }
                    placeholder="تفاصيل حول جودة الصنع، المواد، الأبعاد..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-gold font-arabic text-right leading-relaxed"
                  />
                </div>
              </div>

              {/* Form Buttons */}
              <div className="pt-4 border-t border-neutral-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-neutral-200 text-neutral-600 font-bold text-xs hover:bg-neutral-100 transition-colors cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSavingProduct}
                  className="bg-gold-gradient text-black px-6 py-2.5 rounded-xl font-bold text-xs hover:bg-gold-gradient-dark transition-all shadow-gold cursor-pointer flex items-center gap-2"
                >
                  {isSavingProduct ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Enregistrement...</span>
                    </>
                  ) : (
                    <span>{editingProduct ? 'Enregistrer les Modifications' : 'Publier le Produit'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
