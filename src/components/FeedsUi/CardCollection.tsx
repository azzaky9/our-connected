'use client'

import React from 'react'
import { ObjectFieldTypes } from '@/types/type'
import Card from './Card'
import { TFeedsDataQuery } from '@/hooks/useSource'

interface TCardCollection {
  source: ObjectFieldTypes[]
}

const CardCollection: React.FC<TCardCollection> = ({ source }) => {
  return (
    <React.Fragment>
      {source.map((value) => (
        <Card dataSource={value} withButton key={value.id} />
      ))}
    </React.Fragment>
  )
}

export default CardCollection
