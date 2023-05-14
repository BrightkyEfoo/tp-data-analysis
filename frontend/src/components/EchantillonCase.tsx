import React, { ChangeEvent, FC } from 'react'

type Props = {
    index : number
    value : number
    onChange : (e: ChangeEvent<HTMLInputElement>)=> void
}

const EchantillonCase : FC<Props>= ({index , value , onChange}) => {
  return (
    <input type='number' onChange={e => onChange(e)}/>
  )
}

export default EchantillonCase