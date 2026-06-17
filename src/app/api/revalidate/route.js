import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'
import crypto from 'crypto'

const SECRET = process.env.SHOPIFY_WEBHOOK_SECRET

function verifyHmac(body, hmacHeader) {
  if (!SECRET) return true // skip in dev if secret not set
  const digest = crypto
    .createHmac('sha256', SECRET)
    .update(body, 'utf8')
    .digest('base64')
  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(hmacHeader))
}

export async function POST(req) {
  const hmacHeader = req.headers.get('x-shopify-hmac-sha256') ?? ''
  const rawBody = await req.text()

  if (!verifyHmac(rawBody, hmacHeader)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const topic = req.headers.get('x-shopify-topic') ?? ''

  if (topic.startsWith('products/') || topic.startsWith('collections/')) {
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
