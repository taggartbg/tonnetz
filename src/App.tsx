import React, { Component } from 'react';
import { HexGrid, Layout, Hexagon, GridGenerator } from 'react-hexgrid';
import HexPad from './components/HexPad';
import './App.css';

class App extends Component {
  render() {
    const hexagons = GridGenerator.hexagon(2);

    return (
      <div className="App">
        <HexGrid width={1200} height={900}>
          <Layout size={{ x: 7, y: 7 }}>
            <g transform={'rotate(30)'}>
            { hexagons.map((hex, i) => <HexPad key={i} q={hex.q} r={hex.r} s={hex.s} h={hex}/>) }
            </g>
          </Layout>
        </HexGrid>
      </div>
    );
  }
}

export default App;
