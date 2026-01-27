'use client'

import { Media } from '@/components/Media'
import type { Page } from '@/payload-types'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import type { MotionValue } from 'framer-motion'
import { motion, useAnimationFrame, useMotionValue, useReducedMotion, useTransform } from 'framer-motion'
import Link from 'next/link'
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'

type HomeHeroProps = Page['hero']

const isHomeHero = (
  h: HomeHeroProps,
): h is HomeHeroProps & Required<Pick<HomeHeroProps, 'left' | 'right'>> => h?.type === 'homeHero'

type ArrayElement<T> = T extends Array<infer U> ? U : never
type Right = NonNullable<HomeHeroProps['right']>
type Cards = NonNullable<Right['cards']>
type Card = ArrayElement<Cards>

const INFO_CARD_STYLES: Record<string, string> = {
  roza: 'bg-roza hover:bg-roza-hover',
  oranzna: 'bg-oranzna hover:bg-oranzna-hover',
  rumena: 'bg-rumena hover:bg-rumena-hover',
  zelena: 'bg-zelena hover:bg-zelena-hover',
  vijolicna: 'bg-vijolicna hover:bg-vijolicna-hover',
  modra: 'bg-modra hover:bg-modra-hover',
  mint: 'bg-mint hover:bg-mint-hover',
}

const BALLS = [
  { src: 'https://bloom42-media.s3.eu-central-1.amazonaws.com/yellowball2.svg', size: 100 },
  { src: 'https://bloom42-media.s3.eu-central-1.amazonaws.com/blue-ball.svg', size: 100 },
  { src: 'https://bloom42-media.s3.eu-central-1.amazonaws.com/pinkball.svg', size: 100 },
] as const

function useArcPosition(
  progress: MotionValue<number>,
  pathRef: React.RefObject<SVGPathElement | null>,
  pathLen: number,
) {
  const x = useTransform<number, number>(progress, (t) => {
    const p = pathRef.current
    if (!p || !pathLen) return 0
    return p.getPointAtLength(t * pathLen).x
  })

  const y = useTransform<number, number>(progress, (t) => {
    const p = pathRef.current
    if (!p || !pathLen) return 0
    return p.getPointAtLength(t * pathLen).y
  })

  return { x, y }
}

function FloatingBallsOnArc() {
  const reduceMotion = useReducedMotion()
  const wrapRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)

  const [box, setBox] = useState({ w: 0, h: 0 })
  const [pathLen, setPathLen] = useState(0)

  // Measure container so SVG user-units == px (responsive)
  useLayoutEffect(() => {
    const el = wrapRef.current
    if (!el) return

    const ro = new ResizeObserver(() => {
      const r = el.getBoundingClientRect()
      setBox({ w: Math.max(0, r.width), h: Math.max(0, r.height) })
    })

    ro.observe(el)
    const r = el.getBoundingClientRect()
    setBox({ w: Math.max(0, r.width), h: Math.max(0, r.height) })

    return () => ro.disconnect()
  }, [])

  // Arc path (top-ish curve)
  const d = useMemo(() => {
    const w = box.w
    const h = box.h
    if (!w || !h) return ''
    const y = 0.55 * h
    const cx = 0.5 * w
    const cy = 0.02 * h
    return `M ${-0.15 * w} ${y} Q ${cx} ${cy} ${1.15 * w} ${y}`
  }, [box.w, box.h])

  // Update path length when size changes (after d/viewBox update)
  useEffect(() => {
    const p = pathRef.current
    if (!p) return
    try {
      setPathLen(p.getTotalLength())
    } catch {
      setPathLen(0)
    }
  }, [d, box.w, box.h])

  // ✅ One continuous progress driver (never resets => no loop glitch)
  const base = useMotionValue<number>(0)

  // Speed: one full loop per DURATION seconds
  const DURATION_S = 15
  const startOffset = 0.18 // start "already animated" so balls are visible on load

  useAnimationFrame((_t, deltaMs) => {
    if (reduceMotion) return
    const delta = deltaMs / (DURATION_S * 1000)
    base.set(base.get() + delta)
  })

  // Wrap a number to [0, 1)
  const wrap01 = (v: number) => ((v % 1) + 1) % 1

  // ✅ Three balls: same speed, evenly phase-shifted, all derived from ONE base driver
  const p0 = useTransform<number, number>(base, (v) => wrap01(v + startOffset + 0 / 3))
  const p1 = useTransform<number, number>(base, (v) => wrap01(v + startOffset + 1 / 3))
  const p2 = useTransform<number, number>(base, (v) => wrap01(v + startOffset + 2 / 3))

  const a0 = useArcPosition(p0, pathRef, pathLen)
  const a1 = useArcPosition(p1, pathRef, pathLen)
  const a2 = useArcPosition(p2, pathRef, pathLen)

  if (reduceMotion) return null

  return (
    <div ref={wrapRef} className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {/* Invisible SVG path used as the motion track */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox={`0 0 ${box.w || 1} ${box.h || 1}`}
        preserveAspectRatio="none"
      >
        <path ref={pathRef} d={d} fill="none" stroke="transparent" strokeWidth="2" />
      </svg>

      {/* Balls moving on the SAME path */}
      <motion.img
        src={BALLS[0].src}
        alt=""
        width={BALLS[0].size}
        height={BALLS[0].size}
        className="absolute select-none"
        style={{ left: 0, top: 0, x: a0.x, y: a0.y, translateX: '-50%', translateY: '-50%' }}
      />
      <motion.img
        src={BALLS[1].src}
        alt=""
        width={BALLS[1].size}
        height={BALLS[1].size}
        className="absolute select-none"
        style={{ left: 0, top: 0, x: a1.x, y: a1.y, translateX: '-50%', translateY: '-50%' }}
      />
      <motion.img
        src={BALLS[2].src}
        alt=""
        width={BALLS[2].size}
        height={BALLS[2].size}
        className="absolute select-none"
        style={{ left: 0, top: 0, x: a2.x, y: a2.y, translateX: '-50%', translateY: '-50%' }}
      />
    </div>
  )
}

export const HomeHero: React.FC<HomeHeroProps> = (props) => {
  const { setHeaderTheme } = useHeaderTheme()

  useEffect(() => {
    setHeaderTheme('light')
  }, [setHeaderTheme])

  if (!isHomeHero(props)) return null

  const { left, right } = props
  const cards = (right?.cards ?? []) as Card[]

  const row1 = cards.slice(0, 3)
  const middleRight = cards[3]
  const row3 = cards.slice(4, 7)

  const heroPhoto = left?.photo && typeof left.photo === 'object' ? left.photo : undefined

  const renderInfoCard = (card: Card | undefined, key: React.Key, extraClass = '') => {
    if (!card || card.blockType !== 'infoCard') return <div key={key} />

    const href = 'href' in card && card.href ? card.href : undefined
    const isLinked = !!href
    const styleClasses = INFO_CARD_STYLES[card.color || 'roza'] ?? INFO_CARD_STYLES.roza

    const inner = (
      <div className="w-full h-full aspect-square xl:aspect-[4/3]">
        <div
          className={`
            w-full h-full rounded-xl px-6 py-7 flex flex-col items-center justify-center text-center
            transition-all duration-500 hover:-translate-y-1
            ${styleClasses}
            ${isLinked ? 'cursor-pointer' : ''}
            ${extraClass}
          `}
        >
          {card.icon && typeof card.icon === 'object' && (
            <div className="mb-2 h-[50px] w-[50px] flex flex-col items-center justify-center">
              <Media resource={card.icon} imgClassName="object-contain" />
            </div>
          )}
          <h3 className="text-sm md:text-base font-semibold leading-snug">{card.heading}</h3>
        </div>
      </div>
    )

    return isLinked ? (
      <Link key={key} href={href} className="block h-full">
        {inner}
      </Link>
    ) : (
      <React.Fragment key={key}>{inner}</React.Fragment>
    )
  }

  return (
    <section className="relative bg-background py-12 md:py-16 lg:py-20 overflow-visible">
      <div
        className="
          container
          grid grid-cols-1
          items-center lg:items-stretch
          gap-4 lg:grid-cols-[1.1fr_1.4fr] lg:gap-16
        "
      >
        {/* LEFT: image */}
        <div className="flex justify-center lg:h-full">
          <div className="relative w-full max-w-[520px] overflow-hidden rounded-xl bg-muted aspect-square lg:aspect-auto lg:h-full">
            {/* Balls behind */}
            <FloatingBallsOnArc />

            {/* Hero photo above */}
            {heroPhoto && (
              <div className="absolute inset-0 z-10">
                <Media resource={heroPhoto} fill priority imgClassName="object-contain object-bottom" />
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: grid + title */}
        <div className="w-full h-full">
          <div className="grid grid-cols-2 gap-4 md:gap-5 md:grid-cols-3 lg:gap-6 h-full">
            {row1.map((card, idx) => renderInfoCard(card, `row1-${idx}`))}

            <div
              className="
                hidden lg:flex md:col-span-2 md:row-start-2
                h-full rounded-3xl bg-white
                items-center justify-center text-center px-6
              "
            >
              <div className="text-left">
                {left?.title && <h2 className="text-6xl font-[800] tracking-tight leading-tight">{left.title}</h2>}
              </div>
            </div>

            {renderInfoCard(middleRight, 'middle-right', 'md:row-start-2 md:col-start-3')}

            {row3.map((card, idx) => renderInfoCard(card, `row3-${idx}`))}
          </div>
        </div>
      </div>
    </section>
  )
}
