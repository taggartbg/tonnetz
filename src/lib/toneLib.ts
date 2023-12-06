
import * as Tone from 'tone';

const INTERVAL_SEMITONES = 7 // perfect 5th
const ROW_SEMITONES = 4 // major 3rd

// This Scale + Scale Offset puts the 0,0,0 hex at C4
const SCALE = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B',
]
const BASE_SCALE_OFFSET = 4

const getTone = ({ rowOffset, rowSemitones, intervalOffset, intervalSemitones }:
  { rowOffset: number, rowSemitones: number, intervalOffset: number, intervalSemitones: number}) => {
 const scale = rowOffset > -1
    ? SCALE.map((x, i) => SCALE[(i + rowOffset * rowSemitones) % 12])
    : SCALE.map((x, i) => SCALE[(i + (144 + rowOffset * rowSemitones)) % 12])

  let note = intervalOffset > -1
    ? scale[(intervalOffset * intervalSemitones) % 12]
    : scale[((144 + (intervalOffset * intervalSemitones)) % 12)]

  let scaleOffset = BASE_SCALE_OFFSET + Math.floor((rowOffset * rowSemitones) / 12)
  // NOTE: This is a hack and should be resolved with math
  const cPos = scale.findIndex(x => x === 'C')
  if (cPos >= BASE_SCALE_OFFSET && scale.findIndex(x => x === note) > cPos) {
    scaleOffset++;
  }

  return `${note}${scaleOffset + Math.floor((intervalOffset * INTERVAL_SEMITONES) / 12)}`
}

const playTone = (tone: string) => {
  console.log("PLAYING:", tone)
  const synth = new Tone.Synth().toDestination();
  synth.triggerAttackRelease(tone, '8n')
}

const synth = new Tone.PolySynth().toDestination();
const playPolyTones = (tones: string[]) => {
  synth.triggerAttack(tones)
}
const stopPolyTones = (tones: string[]) => {
  synth.triggerRelease(tones)
}

export { getTone, playTone, playPolyTones, stopPolyTones, SCALE, BASE_SCALE_OFFSET }