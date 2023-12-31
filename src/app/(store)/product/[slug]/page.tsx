import { Product } from '@/@types/product'
import { AddToCartButton } from '@/components/add-to-cart-button'
import { api } from '@/data/api'
import { Metadata } from 'next'
import Image from 'next/image'

async function getProduct(slug: string): Promise<Product> {
  const response = await api(`/products/${slug}`, {
    next: {
      revalidate: 60 * 60, // 1 hour
    },
  })

  const products = await response.json()

  return products
}

type ProductProps = {
  params: {
    slug: string
  }
}

export async function generateMetadata({
  params,
}: ProductProps): Promise<Metadata> {
  const product = await getProduct(params.slug)

  return {
    title: product.title,
  }
}

export async function generateStaticParams() {
  const response = await api('/products/featured')
  const products: Product[] = await response.json()

  return products.map((product) => {
    return { slug: product.slug }
  })
}

export default async function Product({ params }: ProductProps) {
  const product = await getProduct(params.slug) // because of memoization, the HTTP request on metadata doesn't duplicate

  return (
    <div className="relative grid max-h-[860px] grid-cols-3">
      <div className="col-span-2 overflow-hidden">
        <Image
          src={product.image}
          alt=""
          width={1000}
          height={1000}
          quality={100}
        />
      </div>

      <div className=" flex flex-col justify-center px-12">
        <h1 className="text-3xl font-bold leading-tight">{product.title}</h1>
        <p className="mt-2 leading-relaxed text-zinc-400">
          Camiseta fabricada com 100% de algodão.
        </p>

        <div className="mt-8 flex items-center gap-3">
          <span className="inline-block rounded-full bg-violet-500 px-5 py-2.5 font-semibold">
            R${' '}
            {product.price.toLocaleString('pt-BR', {
              currency: 'BRL',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
          </span>
          <span className="text-sm text-zinc-400">
            Em 12x s/juros de{' '}
            {(product.price / 12).toLocaleString('pt-BR', {
              currency: 'BRL',
            })}
          </span>
        </div>

        <div className="mt-8 space-y-4">
          <span className="block font-semibold">Tamanhos</span>
          <div className="flex gap-2">
            <button
              type="button"
              className="flex h-9 w-14 items-center justify-center rounded-full bg-zinc-800 text-sm font-semibold ring-1 ring-zinc-700"
            >
              P
            </button>
            <button
              type="button"
              className="flex h-9 w-14 items-center justify-center rounded-full bg-zinc-800 text-sm font-semibold ring-1 ring-zinc-700"
            >
              M
            </button>
            <button
              type="button"
              className="flex h-9 w-14 items-center justify-center rounded-full bg-zinc-800 text-sm font-semibold ring-1 ring-zinc-700"
            >
              G
            </button>
            <button
              type="button"
              className="flex h-9 w-14 items-center justify-center rounded-full bg-zinc-800 text-sm font-semibold ring-1 ring-zinc-700"
            >
              GG
            </button>
          </div>
        </div>

        <AddToCartButton productId={product.id} />
      </div>
    </div>
  )
}
