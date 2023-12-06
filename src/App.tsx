import React, { Component } from 'react';
import { HexGrid, Layout, GridGenerator } from 'react-hexgrid';
import HexPad from './components/HexPad';
import './App.css';
import { playPolyTones, playTone, stopPolyTones } from './lib/toneLib';
import { styled } from 'styled-components'

class App extends Component<{}, { tones: string[], revealedTones: string[], mode: 'explore'|'reveal'|'express' }> {
  constructor(props: Record<any, any>) {
    super(props);
    this.state = {tones: [], revealedTones: [], mode: 'explore'};
  }

  toggleTone(tone: string) {
    stopPolyTones(this.state && this.state.tones || []);

    // this is gross
    const toneIdx = this.state.tones.indexOf(tone)
    if (toneIdx > -1) {
      if (this.state.mode === 'explore') {
        this.setState({
          tones: this.state.tones.filter((x, i) => i !== toneIdx),
          revealedTones: this.state.tones.filter((x, i) => i !== toneIdx)
        }, () => playPolyTones(this.state.tones))
      } else if (this.state.mode === 'express') {
        this.setState({
          tones: []
        })
      }
    } else {
      if (this.state.mode === 'reveal') {
        this.setState({
          revealedTones: [...this.state.revealedTones, tone]
        }, () => playTone(tone))
      } else {
        this.setState({
          tones: [...this.state.tones, tone],
          revealedTones: [...this.state.revealedTones, tone]
        }, () => playPolyTones(this.state.tones))
      }
    }
  }

  toggleMode(mode:'explore'|'reveal'|'express') {
    stopPolyTones(this.state && this.state.tones || []);
    this.setState({ mode, tones: [], revealedTones: [] })
  }

  render() {
    const hexagons = GridGenerator.hexagon(4);

    return (
      <div className="App">
        <Modes>
          <div onClick={() => this.toggleMode('explore')} style={this.state.mode === 'explore' ? {color: 'yellow'} : undefined}>explore</div>
          <div onClick={() => this.toggleMode('reveal')} style={this.state.mode === 'reveal' ? {color: 'yellow'} : undefined}>reveal</div>
          <div onClick={() => this.toggleMode('express')} style={this.state.mode === 'express' ? {color: 'yellow'} : undefined}>express</div>
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