import logo from './logo.svg';
import './App.css';

import { ReactP5Wrapper } from "@p5-wrapper/react";

import React, { useState, useEffect } from 'react';
import {Animation1} from './animation/animation1';
import {Animation2} from './animation/animation2';
import {Animation3} from './animation/animation3';

function App() {
  const [animationKey, setAnimationKey] = useState(0);
  
  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
    const wsURL = `${protocol}${window.location.host}`;
    console.log(wsURL);
    const ws = new WebSocket(wsURL);

    ws.onmessage = function (event) {
      if (event.data === 'reload') {
        setAnimationKey((prevKey) => prevKey + 1);
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <ReactP5Wrapper key={animationKey} sketch={Animation1} />
      </header>
    </div>
  );
}

export default App;