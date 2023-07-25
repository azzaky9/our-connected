'use client'

import React from 'react'

interface TPropsExpandContent {
  text: string
  onExpanded: boolean
  setExpandState: React.Dispatch<React.SetStateAction<boolean>>
}

const ExpandCtnt: React.FC<TPropsExpandContent> = ({
  text,
  onExpanded,
  setExpandState,
}) => {
  const newLineRegExp = /__NEWLINE__/g
  const contents = text.replace(newLineRegExp, '\n')
  const isContentToLong = text.split(' ').length > 75
  return (
    <React.Fragment>
      <article
        className={`${
          onExpanded ? 'h-fit whitespace-pre-wrap' : 'h-24 overflow-hidden'
        }  text-sm`}
      >
        {contents}
      </article>
      {!onExpanded && isContentToLong ? (
        <span
          onClick={() => setExpandState(true)}
          className='hover:cursor-row-resize bg-gradient-to-r text-zinc-400 from-transparent from-10% via-slate-950 via-50% to-slate-950 to-60% absolute bottom-[22px] right-8 pl-7 pr-2 z-10'
        >
          read
        </span>
      ) : null}
    </React.Fragment>
  )
}

export default ExpandCtnt
