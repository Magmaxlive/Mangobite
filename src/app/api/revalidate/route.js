import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'
import crypto from 'crypto'

const SECRET = process.env.SHOPIFY_WEBHOOK_SECRET

function verifyHmac(body, hmacHeader) {
  if (!SECRET) return true
  if (!hmacHeader) return false
  const digest = crypto.createHmac('sha256', SECRET).update(body, 'utf8').digest('base64')
  const a = Buffer.from(digest)
  const b = Buffer.from(hmacHeader)
  if (a.length !== b.length) return false
  return crypto.timingSafeEqual(a, b)
}

export async function POST(req) {
  const hmacHeader = req.headers.get('x-shopify-hmac-sha256') ?? ''
  const rawBody = await req.text()

  if (!verifyHmac(rawBody, hmacHeader)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const topic = req.headers.get('x-shopify-topic') ?? ''

  if (topic.startsWith('products/') || topic.startsWith('collections/') || topic.startsWith('inventory_items/')) {
    revalidatePath('/', 'page')
    revalidatePath('/shop', 'page')
    revalidatePath('/shop/[handle]', 'page')
  }

  if (topic.startsWith('articles/') || topic.startsWith('blogs/')) {
    revalidatePath('/blog', 'page')
    revalidatePath('/blog/[blogHandle]/[articleHandle]', 'page')
  }

  if (topic === 'metaobjects/update' || topic === 'metaobjects/create' || topic === 'metaobjects/delete') {
    revalidatePath('/', 'layout')
  }

  return NextResponse.json({ revalidated: true, topic })
}
