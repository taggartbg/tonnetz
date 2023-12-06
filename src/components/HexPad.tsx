import React, { useEffect, useMemo, useState } from 'react';
import { styled } from 'styled-components';
import { Hexagon, Text } from 'react-hexgrid';
import { getTone } from '../lib/toneLib';
import { getColorForTone } from '../lib/colors';

interface props {
  q: number,
  r: number,
  s: number,
  toggleTone: (tone: string) => void,
  playingTones: string[],
  revealedTones: string[],
}

const HexPad: React.FC<props> = ({ q, r, s, toggleTone, revealedTones = [], playingTones = [] }) => {
  const [color, setColor] = useState('#000')
  const tone = useMemo(() => {
    return getTone({
      rowOffset: -s,
      intervalOffset: -r
    })
  }, [s, r]);

  useEffect(() => {
    if (revealedTones.indexOf(tone) > -1) {
      setColor(getColorForTone(tone))
    } else {
      setColor('#000')
    }
  }, [revealedTones])

  const handleClick = () => {
    toggleTone(tone)
  }

  return (
    <Hex q={q} r={r} s={s} stroke={'#fff'} onClick={handleClick} c={color}>
      {
        playingTones.indexOf(tone) > -1
        ? <Text strokeWidth={0} style={{pointerEvents: 'none'}}>&#8226;</Text>
        : null
      }
    </Hex>
  )
}

export default HexPad

const Hex = styled(Hexagon)<{ c: string }>`
  g polygon {
    fill: ${props => props.c || '#000'};

    transition: fill 0.5s;
  }
`