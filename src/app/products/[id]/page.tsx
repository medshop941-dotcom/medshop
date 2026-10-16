import { Metadata } from 'next'
import { PRODUCTS, getProductById } from '@/data/products'
import { ProductDetailView } from '@/components/ProductDetailView'

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
  const product = getProductById(id)

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
  const product = getProductById(id)

  return <ProductDetailView product={product} />
}
