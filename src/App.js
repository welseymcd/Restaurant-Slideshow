import React from 'react';
import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";
import Bar from "./components/Bar";
import { Box } from '@material-ui/core';
import Slideshow from "./components/Slideshow";
import ControlPanel from "./components/ControlPanel/ControlPanel"
import {SlideShowTimer} from "./components/SlideshowPreload";
function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
            <Route exact path="/">
              <Box height="100vh" style={{overflow:"hidden"}}alignItems="center">
                <SlideShowTimer interval={5000} />
              </Box>
              <div className="background">
              </div>
            </Route>
            <Route path="/manage">
              <ControlPanel />
            </Route>
          </Switch>


      </div>
    </Router>
  );
}

export default App;
