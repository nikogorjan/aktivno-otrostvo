import React from 'react'

import type { Page } from '@/payload-types'

import { AboutHero } from '@/heros/AboutHero'
import { HighImpactHero } from '@/heros/HighImpact'
import { HomeHero } from '@/heros/HomeHero'
import { LowImpactHero } from '@/heros/LowImpact'
import { MediumImpactHero } from '@/heros/MediumImpact'
import { ServicesHero } from '@/heros/ServicesHero'

const heroes = {
  highImpact: HighImpactHero,
  lowImpact: LowImpactHero,
  mediumImpact: MediumImpactHero,
  homeHero: HomeHero,
  aboutHero: AboutHero,
  servicesHero: ServicesHero
}

export const RenderHero: React.FC<Page['hero']> = (props) => {
  const { type } = props || {}

  if (!type || type === 'none') return null

  const HeroToRender = heroes[type]

  if (!HeroToRender) return null

  return <HeroToRender {...props} />
}
