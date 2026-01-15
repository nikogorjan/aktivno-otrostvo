import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    console.log('MailerLite subscribe hit') 
  const { email, groupId, doubleOptIn } = await req.json()

  if (!email || !groupId) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const res = await fetch('https://connect.mailerlite.com/api/subscribers', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.MAILERLITE_API_TOKEN}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      email,
      groups: [groupId],
      status: doubleOptIn ? 'unconfirmed' : 'active',
      fields: { source: 'cta-email' },
    }),
  })

  if (!res.ok) {
    const err = await res.json()
    return NextResponse.json({ error: err }, { status: 400 })
  }

  return NextResponse.json({ ok: true })
}
