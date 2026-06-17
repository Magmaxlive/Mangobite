export const dynamic = 'force-dynamic'

import { getProduct, getProducts } from '@/lib/shopify'
import { notFound } from 'next/navigation'
import PageBanner from '@/components/common/PageBanner'
import ProductDetail from '@/components/common/ProductDetail'
import Cards from '@/components/common/Cards'
import SectionHeading from '@/components/common/SectionHeading'

export async function generateStaticParams() {
  const products = await getProducts()
  return products.map(p => ({ handle: p.handle }))
}

const PRODUCT_META = {
  'alphonso-mango': {
    title: 'Buy Alphonso Mangoes Online NZ | Fresh Indian Alphonso Mango',
    description: 'Order fresh Indian Alphonso mangoes online in NZ. Sweet, juicy and premium quality mangoes delivered across Auckland and New Zealand. Pre-book now from MangoBite.',
  },
  'kesar-mango': {
    title: 'Kesar Mango NZ | Buy Fresh Indian Kesar Mangoes Online',
    description: 'Buy fresh Kesar mangoes online in NZ. Authentic Indian mangoes known for rich sweetness and aroma. Mango delivery available across Auckland and New Zealand.',
  },
  'banganapali-badami-mango': {
    title: 'Buy Banganapalli Mango Online NZ | Fresh Indian Mangoes',
    description: 'Shop fresh Banganapalli mangoes online in NZ. Naturally sweet Indian mango variety with rich flavour and smooth texture. Order now from MangoBite.',
  },
  'langda-mango': {
    title: 'Fresh Langda Mango NZ | Buy Indian Mangoes Online',
    description: 'Order fresh Langda mangoes online in Auckland and NZ. Popular Indian mango variety with juicy taste and natural sweetness. Fast mango delivery available.',
  },
  'chaunsa-mango': {
    title: 'Buy Chaunsa Mango Online NZ | Sweet Indian Mangoes',
    description: "Get premium Chaunsa mangoes online in NZ. Delicious, juicy and one of India's famous mango varieties. Fresh Indian mango delivery available. MangoBite NZ",
  },
  'dusheri-mango': {
    title: 'Dusheri Mango NZ | Order Fresh Indian Mangoes Online',
    description: 'Buy fresh Dusheri mangoes online in New Zealand. Sweet Indian mangoes with rich aroma and smooth texture delivered fresh to your doorstep | MangoBite NZ',
  },
  'kesar-twin-box-deal': {
    title: 'Kesar Mango Box Deal NZ | Buy Indian Mangoes Online',
    description: 'Shop Kesar mango twin box deals online in NZ. Fresh Indian mangoes perfect for families and mango lovers. Auckland delivery available | MangoBite NZ',
  },
  'neelam-mango': {
    title: 'Buy Neelam Mango Online NZ | Fresh Mangoes Online',
    description: 'Order Neelam mangoes online in NZ. Sweet and juicy Indian mango variety available for fresh delivery across Auckland and New Zealand | MangoBite NZ',
  },
  'rajapuri-mango': {
    title: 'Rajapuri Mango NZ | Fresh Indian Mangoes for Sale',
    description: 'Buy Rajapuri mangoes online in NZ. Fresh Indian mangoes with delicious taste and premium quality. Mango delivery available across Auckland | MangoBite NZ',
  },
  'totapuri-mango': {
    title: 'Totapuri Mango NZ | Buy Indian Mangoes Online',
    description: 'Shop fresh Totapuri mangoes online in New Zealand. Popular Indian mango variety ideal for eating, juices and recipes. Order now from MangoBite | MangoBite NZ',
  },
  'cheruku-rasalu-mango': {
    title: 'Cheruku Rasalu Mango NZ | Sweet Indian Mango Online',
    description: 'Buy Cheruku Rasalu mangoes online in NZ. Naturally sweet and juicy Indian mangoes delivered fresh across Auckland and New Zealand | MangoBite NZ',
  },
  'payri-mango': {
    title: 'Payri Mango NZ | Fresh Indian Mangoes Online',
    description: 'Order fresh Payri mangoes online in NZ. Premium Indian mango variety with rich sweetness and tropical flavour. Fast mango delivery available | MangoBite NZ',
  },
  'mallika-mango': {
    title: 'Mallika Mango NZ | Buy Fresh Indian Mangoes Online',
    description: 'Buy Mallika mangoes online in Auckland and NZ. Delicious Indian mangoes known for sweetness, aroma and smooth texture. Order fresh mangoes today | MangoBite NZ',
  },
  'green-sour-mango': {
    title: 'Green Sour Mango NZ | Raw Indian Mango Online',
    description: 'Shop fresh green sour mangoes online in NZ. Perfect for pickles, curries and traditional Indian recipes. Fresh mango delivery available | MangoBite NZ',
  },
  'totapuri-raw-green-mango': {
    title: 'Totapuri Raw Mango NZ | Buy Green Mango Online',
    description: 'Buy Totapuri raw green mangoes online in New Zealand. Fresh Indian raw mangoes ideal for pickles and cooking. Order online today.',
  },
  'himayat': {
    title: 'Himayat Mango NZ | Buy Imam Pasand Mango Online',
    description: 'Order Himayat (Imam Pasand) mangoes online in NZ. Premium Indian mango variety famous for rich sweetness and flavour. Fresh delivery available | MangoBite NZ',
  },
  'tella-gulabeelu-pickle-green-mango': {
    title: 'Pickle Green Mango NZ | Fresh Raw Mangoes Online',
    description: 'Buy fresh pickle green mangoes online in NZ. Ideal for Indian pickles and traditional recipes. Order raw mangoes from MangoBite today.',
  },
  'amrapalli-mango': {
    title: 'Amrapali Mango NZ | Buy Indian Mangoes Online',
    description: 'Shop fresh Amrapali mangoes online in NZ. Sweet Indian mangoes with rich flavour and juicy texture delivered fresh across New Zealand | MangoBite NZ',
  },
  'sindhura': {
    title: 'Sindhura Mango NZ | Fresh Indian Mangoes Online',
    description: 'Buy Sindhura mangoes online in Auckland and NZ. Premium Indian mango variety with vibrant colour and delicious sweetness. Order now | MangoBite NZ',
  },
  'pedda-rasallu-mango': {
    title: 'Pedda Rasalu Mango NZ | Sweet Indian Mango Online',
    description: 'Order Pedda Rasalu mangoes online in NZ. Naturally sweet and juicy Indian mangoes delivered fresh to Auckland and across New Zealand | MangoBite NZ',
  },
  'avakai-pickle-green-mango': {
    title: 'Avakai Green Mango NZ | Raw Mango for Pickles Online',
    description: 'Buy Avakai green mangoes online in NZ. Fresh raw Indian mangoes perfect for traditional pickle recipes and cooking. Fast delivery available | MangoBite NZ',
  },
}

export async function generateMetadata({ params }) {
  const { handle } = await params
  const product = await getProduct(handle)
  if (!product) return {}

  const custom = PRODUCT_META[handle]
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL

  return {
    title: custom?.title ?? `${product.title} | Fresh Indian Mangoes NZ | MangoBite`,
    description: custom?.description ?? `Buy fresh ${product.title} online in New Zealand. Premium quality Indian mangoes delivered across Auckland and NZ. Order now from MangoBite.`,
    alternates: { canonical: `${siteUrl}/shop/${handle}` },
  }
}

export default async function ProductPage({ params }) {
  const { handle } = await params
  const product = await getProduct(handle)
  if (!product) notFound()

  return (
    <div className="flex flex-col">
      <PageBanner
        minorTitle="shop"
        title={product.title}
        description=""
        breadCrumbs={[{ label: 'shop', href: '/shop' }, { label: product.title }]}
      />
      <ProductDetail product={product} />

      <div className="max-w-7xl mx-auto">
        <Cards/>
      </div>
    </div>
  )
}
