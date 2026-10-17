import { Metadata } from 'next'
import { PRODUCTS, getProductById } from '@/data/products'
import { fetchCatalogProductsAction } from '@/app/actions/products'
import { ProductDetailView } from '@/components/ProductDetailView'
import { Product } from '@/types/product'

async function findProduct(id: string): Promise<Product | undefined> {
  const local = getProductById(id)
  if (local) return local

  try {
    const live = await fetchCatalogProductsAction()
    return live.find((p) => p.id.toString() === id.toString())
  } catch {
    return undefined
  }
}

export function generateStaticParams() {
  return PRODUCTS.map((product) => ({
    id: product.id.toString(),
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const product = await findProduct(id)

  if (!product) {
    return {
      title: 'Produit introuvable | Med Shop',
      description: 'Le produit recherché est introuvable.',
    }
  }

  return {
    title: `${product.name} - ${product.price} DH | Med Shop Maroc`,
    description: product.description,
    openGraph: {
      title: `${product.name} | Med Shop`,
      description: product.description,
      images: [{ url: product.image }],
    },
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const product = await findProduct(id)

  return <ProductDetailView product={product} />
}
