import configPromise from '@payload-config'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'

type Body = {
  locale?: 'en' | 'sl'
  formId?: string
  form?: string
  submissionData?: Array<{ field: string; value: any }>
  zoomLink?: string
}

function upsertField(
  submissionData: Array<{ field: string; value: any }>,
  field: string,
  value: any,
) {
  const idx = submissionData.findIndex((x) => x.field === field)
  if (idx >= 0) submissionData[idx] = { field, value }
  else submissionData.push({ field, value })
  return submissionData
}

export async function POST(req: Request) {
  let body: Body
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, code: 'bad_request' }, { status: 400 })
  }

  const form = body.formId ?? body.form
  const submissionDataRaw = body.submissionData

  const resolvedLocale: 'en' | 'sl' | undefined =
    body.locale === 'en' || body.locale === 'sl' ? body.locale : undefined

  if (!form || !Array.isArray(submissionDataRaw)) {
    return NextResponse.json({ ok: false, code: 'bad_request' }, { status: 400 })
  }

  const zoomLink = typeof body.zoomLink === 'string' ? body.zoomLink.trim() : ''

  if (!zoomLink) {
    return NextResponse.json({ ok: false, code: 'missing_zoom_link' }, { status: 400 })
  }

  // Clone so we can safely add our injected field
  const submissionData = [...submissionDataRaw]

  // ✅ This is what your Forms plugin email template should use
  // Add a field named "zoomLink" to the Form builder (hidden/text) and include it in email body.
  upsertField(submissionData, 'zoomLink', zoomLink)

  const payload = await getPayload({ config: configPromise })

  try {
    await payload.create({
      collection: 'form-submissions',
      data: {
        form,
        submissionData,
      },
      locale: resolvedLocale,
    })
  } catch (e) {
    console.log('Form submission create failed:', e)
    return NextResponse.json({ ok: false, code: 'submission_failed' }, { status: 400 })
  }

  // ✅ Forms plugin handles user/admin emails (localized) based on the Form config
  return NextResponse.json({ ok: true, code: 'submitted' })
}
