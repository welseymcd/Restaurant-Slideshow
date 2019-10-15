import React from 'react';
import logo from './logo.svg';
import './App.css';

import Bar from "./components/Bar";
import { Box } from '@material-ui/core';
import Slideshow from "./components/Slideshow";
import ControlPanel from "./components/ControlPanel/ControlPanel"
function App() {
  return (
    <div className="App">

      <Box height="99.77vh" alignItems="center">
        <Slideshow />
      </Box>
      <div className="background">

      </div>
    </div>
  );
}

export default App;
