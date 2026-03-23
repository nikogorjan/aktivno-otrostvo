import { FormBlock } from '@/blocks/Form/Component'
import { toKebabCase } from '@/utilities/toKebabCase'
import React, { Fragment } from 'react'

import type { Page } from '../payload-types'
import { CtaBackgroundSectionBlock } from './CtaBackgroundBlock/Component'
import { CtaEmailBlock } from './CtaEmail/Component'
import { FaqSectionBlock } from './Faq/Component'
import { ProgramGridSection } from './ProgramGridSection/Components'
import { RoadmapSectionBlock } from './RoadmapBlock/Component'
import { TabsSectionBlock } from './Tabs/Component'
import { TestimonialsBlock } from './Testimonials/Components'
import { ValuesSectionBlock } from './ValuesBlock/Components'
import { VideoSectionBlock } from './VideoSection/Component'
import { ZoomMeetingCardBlock } from './ZoomMeetingCard/Component'

const blockComponents = {
  formBlock: FormBlock,
  tabsSection: TabsSectionBlock,
  faqSection: FaqSectionBlock,
  testimonials: TestimonialsBlock,
  ctaEmail: CtaEmailBlock,
  videoSection: VideoSectionBlock,
  valuesSection: ValuesSectionBlock,
  roadmapSection: RoadmapSectionBlock,
  ctaBackgroundSection: CtaBackgroundSectionBlock,
  programGridSection: ProgramGridSection,
  zoomMeetingCard: ZoomMeetingCardBlock
}

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockName, blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              return (
                <div className="" key={index}>
                  {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                  {/* @ts-ignore - weird type mismatch here */}
                  <Block id={toKebabCase(blockName!)} {...block} />
                </div>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
