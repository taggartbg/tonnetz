import { Component } from 'react';
import { HexGrid, Layout, GridGenerator } from 'react-hexgrid';
import HexPad from './components/HexPad';
import './App.css';
import { changePattern, play, playTone, stopPolyTones, SCALE, stopArp, playPolyTones } from './lib/toneLib';
import { styled } from 'styled-components'

interface ComponentState {
  tones: string[],
  revealedTones: string[],
  mode: 'explore'|'reveal'
  spread: number,
  climb: number
  voice: 'mono'|'poly'
  arp: any
  arpPattern: number
}

class App extends Component<{}, ComponentState> {
  constructor(props: Record<any, any>) {
    super(props);
    this.state = {
      tones: [],
      revealedTones: [],
      mode: 'explore',
      spread: 7,
      climb: 4,
      voice: 'poly',
      arp: null,
      arpPattern: 0
    };
  }

  toggleTone(tone: string) {
    stopPolyTones(this.state && this.state.tones || [])
    stopArp(this.state.arp)

    // this is gross
    const toneIdx = this.state.tones.indexOf(tone)
    if (toneIdx > -1) {
        this.setState({
          tones: []
        })
    } else {
      if (this.state.voice === 'mono') {
        this.setState({
          revealedTones: [...this.state.revealedTones, tone]
        }, () => playTone(tone))
      } else {
        this.setState({
          tones: [...this.state.tones, tone],
          revealedTones: [...this.state.revealedTones, tone]
        }, () => {
          // setState Callback
          // playPolyTones(this.state.tones)
          const arp = play(this.state.tones, this.state.arpPattern)
          this.setState({ arp })
        })
      }
    }
  }

  toggleMode(mode:'explore'|'reveal') {
    stopPolyTones(this.state && this.state.tones || []);
    this.setState({ mode, tones: [], revealedTones: mode === 'reveal' ? SCALE : [] })
  }

  changeSpread(delta: number) {
    const newSpread = this.state.spread + delta

    if (newSpread > 0 && newSpread < 12) {
      this.setState({
        spread: newSpread
      })
    }
  }

  changeClimb(delta: number) {
    const newClimb = this.state.climb + delta

    if (newClimb > 0 && newClimb < 12) {
      this.setState({
        climb: newClimb
      })
    }
  }

  changeVoice(voice: 'mono'|'poly') {
    this.setState({ voice })
  }

  changeArpPattern(arpPattern: number) {
    this.setState({ arpPattern }, () => {
      if (this.state.arp) {
        changePattern(this.state.arp, this.state.arpPattern)
      }
      if (this.state.arpPattern === 0) {
        stopArp(this.state.arp)
        this.setState({ arp: null })
        playPolyTones(this.state.tones)
      } else {
        stopPolyTones(this.state.tones)
      }
      if (this.state.arpPattern !== 0 && !this.state.arp) {
        stopPolyTones(this.state.tones)
        const arp = play(this.state.tones, this.state.arpPattern)
        this.setState({ arp })
      }
    })
  }

  render() {
    const hexagons = GridGenerator.hexagon(4);

    return (
      <div className="App">
        <Config>
          <div style={{userSelect: 'none'}}>
            <span>
              <span style={{width: 105, display: 'inline-block'}}>Voice</span>
              <ConfigControl onClick={() => this.changeVoice('mono')}>{this.state.voice === 'mono' ? 'MONO' : 'mono'}</ConfigControl>
              <ConfigControl onClick={() => this.changeVoice('poly')}>{this.state.voice === 'poly' ? 'POLY' : 'poly'}</ConfigControl>
            </span>
          </div>
          <div style={{userSelect: 'none'}}>
            <span>
              <span style={{width: 105, display: 'inline-block'}}>Arp</span>
              <ConfigControl onClick={() => this.changeArpPattern((this.state.arpPattern + 1) % 6)}>{this.state.arpPattern}</ConfigControl>
            </span>
          </div>
          <div style={{userSelect: 'none'}}>
            <span style={{width: 195, display: 'inline-block'}}>Spread &#8703; <b>{this.state.spread}</b></span>
            <ConfigControl onClick={() => this.changeSpread(-1)}>-</ConfigControl>
            <ConfigControl onClick={() => this.changeSpread(1)}>+</ConfigControl>
          </div>
          <div style={{userSelect: 'none'}}>
            <span style={{width: 195, display: 'inline-block'}}>Climb &#8691; <b>{this.state.climb}</b></span>
            <ConfigControl onClick={() => this.changeClimb(-1)}>-</ConfigControl>
            <ConfigControl onClick={() => this.changeClimb(1)}>+</ConfigControl>
          </div>
        </Config>
        <Modes>
          <div onClick={() => this.toggleMode('explore')} style={this.state.mode === 'explore' ? {color: 'yellow'} : undefined}>explore</div>
          <div onClick={() => this.toggleMode('reveal')} style={this.state.mode === 'reveal' ? {color: 'yellow'} : undefined}>reveal</div>
        </Modes>
        <HexGrid width={1200} height={800}>
          <Layout size={{ x: 7, y: 7 }}>
            <g transform={'rotate(30)'}>
            { hexagons.map((hex, i) => (
              <HexPad
                key={i}
                q={hex.q}
                r={hex.r}
                s={hex.s}
                toggleTone={(tone) => this.toggleTone(tone)}
                revealedTones={this.state.revealedTones}
                playingTones={this.state.tones}
                spread={this.state.spread}
                climb={this.state.climb}
              />
            )) }
            </g>
          </Layout>
        </HexGrid>
      </div>
    );
  }
}

export default App;

const Modes = styled.div`
  position: absolute;
  top: 0;
  right: 15px;
  width: 300px;
  text-align: right;
  font-size: 2.5em;
  font-style: italic;
  line-height: 1.5em;
  color: #aaa;

  div:hover {
    color: #fff;
    cursor: pointer;
  }
`
const Config = styled.label`
  position: absolute;
  top: 0;
  left: 15px;
  width: 300px;
  text-align: left;
  font-size: 2.25em;
  font-style: italic;
  line-height: 1.5em;
  color: #aaa;

  &:focus {
    color: #fff;
    cursor: pointer;
  }
`

const ConfigControl = styled.span`
  color: #fff;
  margin: 0 4px;

  &:hover {
    cursor: pointer;
    color: yellow;
  }
`