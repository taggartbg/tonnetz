
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

const playTone = ({ rowOffset, intervalOffset }: { rowOffset: number, intervalOffset: number}) => {
  const synth = new Tone.Synth().toDestination();
  // synth.triggerAttackRelease("C4", "8n");

  const scale = rowOffset > -1
    ? SCALE.map((x, i) => SCALE[(i + rowOffset * ROW_SEMITONES) % 12])
    : SCALE.map((x, i) => SCALE[(i + (12 + rowOffset * ROW_SEMITONES)) % 12])

  let note = intervalOffset > -1
    ? scale[(intervalOffset * INTERVAL_SEMITONES) % 12]
    : scale[12 + ((intervalOffset * INTERVAL_SEMITONES) % 12)]

  let scaleOffset = BASE_SCALE_OFFSET + Math.floor((rowOffset * ROW_SEMITONES) / 12)
  // NOTE: This is a hack and should be resolved with math
  const cPos = scale.findIndex(x => x === 'C')
  if (cPos >= BASE_SCALE_OFFSET && scale.findIndex(x => x === note) > cPos) {
    scaleOffset++;
  }

  const playing = `${note}${scaleOffset + Math.floor((intervalOffset * INTERVAL_SEMITONES) / 12)}`
  console.log("PLAYING: ", { playing, note, rowOffset, intervalOffset, scale, scaleOffset })

  synth.triggerAttackRelease(playing, '8n')
}

export { playTone }