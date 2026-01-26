import configPromise from '@payload-config'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'

type Body = {
  locale?: 'en' | 'sl'
  form?: string
  formId?: string
  submissionData?: Array<{ field: string; value: any }>
}

export async function POST(req: Request) {
  let body: Body

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, code: 'bad_request' }, { status: 400 })
  }

  const form = body.form ?? body.formId
  const submissionData = body.submissionData

  const resolvedLocale: 'en' | 'sl' | undefined =
    body.locale === 'en' || body.locale === 'sl' ? body.locale : undefined

  if (!form || !Array.isArray(submissionData)) {
    return NextResponse.json({ ok: false, code: 'bad_request' }, { status: 400 })
  }

  const payload = await getPayload({ config: configPromise })

  try {
    await payload.create({
      collection: 'form-submissions',
      data: {
        form,
        submissionData,
      },
      // ✅ critical: this is what makes the Forms plugin emails use EN vs SL
      locale: resolvedLocale,
    })
  } catch (e) {
    console.error('Form submission create failed:', e)
    return NextResponse.json({ ok: false, code: 'submission_failed' }, { status: 400 })
  }

  return NextResponse.json({ ok: true, code: 'submitted' })
}
