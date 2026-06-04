import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

async function sendNotification({ full_name, email, phone, message }) {
  await transporter.sendMail({
    from: `"Mangobite Enquiry" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_TO,
    subject: `New Enquiry from ${full_name}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
        <div style="background:#1e1e1e;padding:24px 32px;text-align:center;">
          <img src="https://mangobite.vercel.app/images/mango_logo.png" alt="Mangobite" style="height:60px;object-fit:contain;" />
          <p style="color:#aaaaaa;margin:8px 0 0;font-size:13px;">New Contact Form Enquiry</p>
        </div>
        <div style="padding:32px;background:#fff;">
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;font-size:13px;width:100px;">Name</td>
              <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;font-weight:600;color:#1e1e1e;">${full_name}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;font-size:13px;">Email</td>
              <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;color:#1e1e1e;"><a href="mailto:${email}" style="color:#FF9308;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;font-size:13px;">Phone</td>
              <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;color:#1e1e1e;">${phone || '—'}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;color:#6b7280;font-size:13px;vertical-align:top;">Message</td>
              <td style="padding:10px 0;color:#1e1e1e;white-space:pre-line;">${message || '—'}</td>
            </tr>
          </table>
        </div>
        <div style="background:#f9fafb;padding:16px 32px;text-align:center;">
          <p style="color:#aaaaaa;font-size:12px;margin:0;">This enquiry was submitted via the Mangobite website contact form.</p>
        </div>
      </div>
    `,
  })
}

async function getAdminToken() {
  const storeDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN
  const res = await fetch(`https://${storeDomain}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: process.env.SHOPIFY_CLIENT_ID,
      client_secret: process.env.SHOPIFY_CLIENT_SECRET,
    }).toString(),
  })
  if (!res.ok) throw new Error(`Token request failed: ${res.status}`)
  const data = await res.json()
  return data.access_token
}

async function adminFetch(storeDomain, token, path, method = 'GET', body) {
  const res = await fetch(`https://${storeDomain}/admin/api/2024-10${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token,
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  return { res, data: await res.json() }
}

export async function POST(request) {
  try {
    const { full_name, email, phone, message } = await request.json()

    const storeDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN
    const token = await getAdminToken()

    const [firstName, ...rest] = (full_name || '').trim().split(' ')
    const lastName = rest.join(' ')
    const note = [phone ? `Phone: ${phone}` : '', message || ''].filter(Boolean).join('\n')

    // Try to create the customer
    const { res, data } = await adminFetch(storeDomain, token, '/customers.json', 'POST', {
      customer: {
        first_name: firstName,
        last_name: lastName || '',
        email,
        note,
        tags: 'contact-form',
      },
    })

    if (res.ok) {
      await sendNotification({ full_name, email, phone, message })
      return Response.json({ success: true })
    }

    // Email already exists — find and update the existing customer
    if (data.errors?.email) {
      const { data: search } = await adminFetch(
        storeDomain, token,
        `/customers/search.json?query=email:${encodeURIComponent(email)}`
      )
      const existing = search?.customers?.[0]
      if (existing) {
        await adminFetch(storeDomain, token, `/customers/${existing.id}.json`, 'PUT', {
          customer: { id: existing.id, note, tags: 'contact-form' },
        })
      }
      await sendNotification({ full_name, email, phone, message })
      return Response.json({ success: true })
    }

    if (data.errors?.phone) throw new Error('Phone number is invalid.')
    throw new Error('Something went wrong. Please try again.')
  } catch (err) {
    return Response.json({ success: false, error: err.message }, { status: 500 })
  }
}
