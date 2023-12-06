import React from 'react';
import { Hexagon } from 'react-hexgrid';
import { playTone } from '../lib/toneLib';

interface props {
  q: number,
  r: number,
  s: number,
  h: any
}

const HexPad: React.FC<props> = ({ q, r, s, h }) => {

  const handleClick = () => {
    console.log({q, r, s, h})

    playTone({
      rowOffset: -s,
      intervalOffset: -r
    })
  }

  return (
    <Hexagon q={q} r={r} s={s} stroke={'#fff'} onClick={handleClick}/>
  )
}

export default HexPad