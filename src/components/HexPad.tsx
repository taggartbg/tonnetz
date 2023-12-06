import React, { useState } from 'react';
import { styled } from 'styled-components';
import { Hexagon } from 'react-hexgrid';
import { getTone, playTone } from '../lib/toneLib';
import { getColorForTone } from '../lib/colors';

interface props {
  q: number,
  r: number,
  s: number,
  h: any
}

const HexPad: React.FC<props> = ({ q, r, s, h }) => {
  const [color, setColor] = useState('000')

  const handleClick = () => {
    console.log({q, r, s, h})

    const tone = getTone({
      rowOffset: -s,
      intervalOffset: -r
    })

    setColor(getColorForTone(tone))

    playTone(tone)
  }

  return (
    <Hex q={q} r={r} s={s} stroke={'#fff'} onClick={handleClick} c={color}/>
  )
}

export default HexPad

const Hex = styled(Hexagon)<{ c: string }>`
  g polygon {
    fill: ${props => props.c || '#000'};
  }
`