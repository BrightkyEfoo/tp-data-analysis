import React, { ChangeEvent, FC, useEffect, useState } from 'react'
import EchantillonCase from './EchantillonCase'
import { Button, Icon } from '@mui/material'
import { EchantillonType } from '../types/states'

type Props = {
    toDelete : (index : number)=>void
    index : number,
    Data : EchantillonType
    last : boolean
    onChange : (echantillon: EchantillonType)=> void
}

const Echantillon : FC<Props> = ({toDelete , index , last , Data , onChange}) => {
    const [data, setData] = useState<EchantillonType>(Data)
    useEffect(()=>{
        onChange(data)
    },[data.elements , data.taille])
  return (
    <div className='an-echan'>
        <input className='input-de-taille' type='number' min={0} placeholder='taille' onChange={e => {
            setData(prev => {
                return ({...prev , taille : e.target.valueAsNumber})
            })
        }}/>
        {
            Array(Math.floor(data.taille) || 0).fill(0).map((el , i)=> {
                return <EchantillonCase key={i} index={i} value={data.elements[i]} onChange={(e : ChangeEvent<HTMLInputElement>)=>{
                    setData(prev => {
                        let tmp = {...prev}
                        tmp.elements[i] = e.target.valueAsNumber
                        return {...tmp}
                    })
                }}/>
            })
        }
        {last && <button className='delete-button' onClick={()=>{
            toDelete(index)
            console.log(`index d : ${index}`)
        }}>Supprimer l'echantillon</button>}
    </div>
  )
}

export default Echantillon