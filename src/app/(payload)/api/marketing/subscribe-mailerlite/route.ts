import configPromise from '@payload-config'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'

export async function POST(req: Request) {
  console.log('MailerLite subscribe hit')

  const { email, groupId, doubleOptIn } = await req.json()

  if (!email || typeof email !== 'string' || !groupId) {
    return NextResponse.json({ ok: false, code: 'bad_request' }, { status: 400 })
  }

  const token = process.env.MAILERLITE_API_TOKEN
  if (!token) {
    return NextResponse.json({ ok: false, code: 'missing_token' }, { status: 500 })
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  }

  // 1️⃣ CHECK if subscriber already exists
  const checkRes = await fetch(
    `https://connect.mailerlite.com/api/subscribers/${encodeURIComponent(email)}`,
    { headers }
  )

  if (checkRes.ok) {
    console.log('Already subscribed:', email)

    // Optional: ensure group is attached (safe idempotent operation)
    await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        email,
        groups: [groupId],
        status: 'active',
      }),
    })

    return NextResponse.json({ ok: true, code: 'already_subscribed' })
  }

  // 404 = not subscribed yet → continue
  if (checkRes.status !== 404) {
    const err = await checkRes.text()
    console.log('MailerLite lookup error:', err)
    return NextResponse.json({ ok: false, code: 'lookup_failed' }, { status: 400 })
  }

  // 2️⃣ CREATE subscriber
  const createRes = await fetch('https://connect.mailerlite.com/api/subscribers', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      email,
      groups: [groupId],
      status: doubleOptIn ? 'unconfirmed' : 'active',
      fields: { source: 'cta-email' },
    }),
  })

  const body = await createRes.json().catch(() => ({}))

  if (!createRes.ok) {
    console.log('MailerLite create error:', body)
    return NextResponse.json({ ok: false, code: 'mailerlite_error', body }, { status: 400 })
  }

  // 3️⃣ Send confirmation email (best effort)
  try {
    const payload = await getPayload({ config: configPromise })

    await payload.sendEmail({
      to: email,
      subject: 'Prijava uspešna',
      html: `
        <p>Hvala za prijavo na e-novičke Aktivno otroštvo. ✅</p>
        <p>Veseli nas, da ste z nami!</p>
        <p>Lep pozdrav,<br/>Aktivno otroštvo</p>
      `,
    })
  } catch (e) {
    console.log('Confirmation email failed:', e)
  }

  return NextResponse.json({
    ok: true,
    code: doubleOptIn ? 'pending_confirmation' : 'subscribed',
  })
}
