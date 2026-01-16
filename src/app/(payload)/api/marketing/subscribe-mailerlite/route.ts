import configPromise from '@payload-config'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'

type LegacyBody = {
  email?: string
  groupId?: string
  doubleOptIn?: boolean
}

type NewBody = {
  locale?: string
  formId?: string
  submissionData?: Array<{ field: string; value: any }>
  mailerLite?: {
    enabled?: boolean
    groupId?: string
    doubleOptIn?: boolean
    email?: string
  }
}

async function mailerLiteCheckAndUpsert(args: {
  email: string
  groupId: string
  doubleOptIn: boolean
}) {
  const token = process.env.MAILERLITE_API_TOKEN
  if (!token) {
    return { ok: false as const, code: 'missing_token' as const }
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  }

  // 1) Check if subscriber exists
  const checkRes = await fetch(
    `https://connect.mailerlite.com/api/subscribers/${encodeURIComponent(args.email)}`,
    { headers },
  )

  if (checkRes.ok) {
    // ensure group attached (idempotent)
    await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        email: args.email,
        groups: [args.groupId],
        status: 'active',
      }),
    })

    return { ok: true as const, code: 'already_subscribed' as const }
  }

  if (checkRes.status !== 404) {
    const txt = await checkRes.text().catch(() => '')
    console.log('MailerLite lookup failed:', checkRes.status, txt)
    return { ok: false as const, code: 'lookup_failed' as const }
  }

  // 2) Create subscriber
  const createRes = await fetch('https://connect.mailerlite.com/api/subscribers', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      email: args.email,
      groups: [args.groupId],
      status: args.doubleOptIn ? 'unconfirmed' : 'active',
      fields: { source: 'cta-email' },
    }),
  })

  if (!createRes.ok) {
    const txt = await createRes.text().catch(() => '')
    console.log('MailerLite create failed:', createRes.status, txt)
    return { ok: false as const, code: 'mailerlite_error' as const }
  }

  return {
    ok: true as const,
    code: args.doubleOptIn ? ('pending_confirmation' as const) : ('subscribed' as const),
  }
}

export async function POST(req: Request) {
  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, code: 'bad_request' }, { status: 400 })
  }

  // -----------------------------
  // ✅ NEW MODE: Forms + MailerLite
  // -----------------------------
  const isNewMode = typeof body?.formId === 'string' && Array.isArray(body?.submissionData)

  if (isNewMode) {
  const { formId, submissionData, mailerLite, locale } = body as NewBody

  const resolvedLocale: 'en' | 'sl' | undefined =
    locale === 'en' || locale === 'sl' ? locale : undefined

  if (!formId || !submissionData) {
    return NextResponse.json({ ok: false, code: 'bad_request' }, { status: 400 })
  }

  const payload = await getPayload({ config: configPromise })

  // If MailerLite enabled, check FIRST
  if (mailerLite?.enabled) {
    const email = mailerLite.email
    const groupId = mailerLite.groupId
    const doubleOptIn = Boolean(mailerLite.doubleOptIn)

    // If enabled but missing config -> treat as ML disabled (still create submission)
    if (email && groupId) {
      const ml = await mailerLiteCheckAndUpsert({ email, groupId, doubleOptIn })

      // ✅ already subscribed -> do NOT create submission -> no payload email
      if (ml.ok && ml.code === 'already_subscribed') {
        return NextResponse.json({ ok: true, code: 'already_subscribed' })
      }

      // Create submission (so Payload can send its email) for new/pending
      try {
        await payload.create({
          collection: 'form-submissions',
          data: {
            form: formId,
            submissionData,
          },
          locale: resolvedLocale,
        })
      } catch (e) {
        console.log('Form submission create failed:', e)
        return NextResponse.json({ ok: false, code: 'submission_failed' }, { status: 400 })
      }

      // return ML-specific code if it succeeded; otherwise generic
      if (ml.ok) return NextResponse.json({ ok: true, code: ml.code })
      return NextResponse.json({ ok: true, code: 'subscribed' })
    }

    console.log('MailerLite enabled but missing email/groupId -> creating submission only')
  }

  // MailerLite disabled (or misconfigured) -> just create submission
  try {
    await payload.create({
      collection: 'form-submissions',
      data: {
        form: formId,
        submissionData,
      },
      locale: resolvedLocale,
    })
  } catch (e) {
    console.log('Form submission create failed:', e)
    return NextResponse.json({ ok: false, code: 'submission_failed' }, { status: 400 })
  }

  return NextResponse.json({ ok: true, code: 'subscribed' })
}

  // -----------------------------
  // ✅ LEGACY MODE: MailerLite only
  // -----------------------------
  const { email, groupId, doubleOptIn } = body as LegacyBody

  if (!email || typeof email !== 'string' || !groupId) {
    return NextResponse.json({ ok: false, code: 'bad_request' }, { status: 400 })
  }

  const ml = await mailerLiteCheckAndUpsert({
    email,
    groupId,
    doubleOptIn: Boolean(doubleOptIn),
  })

  if (!ml.ok) {
    return NextResponse.json({ ok: false, code: ml.code }, { status: 400 })
  }

  return NextResponse.json({ ok: true, code: ml.code })
}
