
import * as Tone from 'tone';

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
    ? SCALE.map((_x, i) => SCALE[(i + rowOffset * rowSemitones) % 12])
    : SCALE.map((_x, i) => SCALE[(i + (144 + rowOffset * rowSemitones)) % 12])

  let note = intervalOffset > -1
    ? scale[(intervalOffset * intervalSemitones) % 12]
    : scale[((144 + (intervalOffset * intervalSemitones)) % 12)]

  let scaleOffset = BASE_SCALE_OFFSET + Math.floor((rowOffset * rowSemitones) / 12)
  // NOTE: This is a hack and should be resolved with math
  const cPos = scale.findIndex(x => x === 'C')
  if (cPos >= BASE_SCALE_OFFSET && scale.findIndex(x => x === note) > cPos) {
    scaleOffset++;
  }

  return `${note}${scaleOffset + Math.floor((intervalOffset * intervalOffset) / 12)}`
}

const playTone = (tone: string) => {
  console.log("PLAYING:", tone)
  const synth = new Tone.Synth().toDestination();
  synth.triggerAttackRelease(tone, '8n')
}

const synth = new Tone.PolySynth().toDestination();
synth.volume.value = -12
const playPolyTones = (tones: string[]) => {
  synth.triggerAttack(tones)
}
const stopPolyTones = (tones: string[]) => {
  synth.triggerRelease(tones)
}


const arpPatterns = [
  "",
  "up",
  "down",
  "upDown",
  "downUp",
  "random"
]

const playArp = (tones: string[], _arpPattern: number) => {
  const arp = new Tone.Pattern(function(_time, note){
    synth.triggerAttackRelease(note, 0.25)
  }, tones, "upDown")
  console.log('usash')
  arp.start(0)
  Tone.Transport.bpm.value = 150
  Tone.Transport.start()

  return arp
}

const changePattern = (arp: any, arpPattern: number) => {
  if (arpPattern === 0) {
    stopArp(arp)
  }
  arp.pattern = arpPatterns[arpPattern]
}

const stopArp = (arp: any) => {
  if (arp && typeof arp?.cancel === 'function' && typeof arp?.dispose === 'function') {
    arp.cancel()
    arp.dispose()
  }
}

const play = (tones: string[], arpPattern?: number) => {
  if (!Number.isInteger(arpPattern)) { return } // TODO: play mono

  if (arpPattern === 0) { return playPolyTones(tones) }

  return playArp(tones, arpPattern || 0)
}

export { getTone, playTone, playPolyTones, stopPolyTones, SCALE, BASE_SCALE_OFFSET, playArp, stopArp, play, changePattern }