import { NextResponse } from 'next/server'
import { getOfferBanners } from '@/lib/shopify'

export async function GET() {
  try {
    const banners = await getOfferBanners()
    return NextResponse.json(banners, {
      headers: { 'Cache-Control': 'no-store' },
    })
  } catch (err) {
    console.error('banners API error:', err)
    return NextResponse.json([], { status: 500 })
  }
}
