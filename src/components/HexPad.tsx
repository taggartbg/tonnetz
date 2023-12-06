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
  spread: number,
  climb: number
}

const HexPad: React.FC<props> = ({ q, r, s, toggleTone, revealedTones = [], playingTones = [], spread, climb }) => {
  const [color, setColor] = useState('#000')
  const tone = useMemo(() => {
    return getTone({
      rowOffset: -s,
      rowSemitones: climb,
      intervalOffset: -r,
      intervalSemitones: spread
    })
  }, [s, r, climb, spread]);

  useEffect(() => {
    const revealedNotes = revealedTones.map(t => t.replace(/[0-9]+/g,''))
    if (revealedNotes.indexOf(tone.replace(/[0-9]+/g,'')) > -1) {
      setColor(getColorForTone(tone))
    } else {
      setColor('#000')
    }
  }, [revealedTones, tone])

  const handleClick = () => {
    toggleTone(tone)
  }

  return (
    <Hex q={q} r={r} s={s} stroke={'#fff'} onClick={handleClick} c={color}>
      {/* <Text fontSize={3} strokeWidth={0}>{tone}</Text> */}
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