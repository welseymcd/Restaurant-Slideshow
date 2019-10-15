import React from 'react';
import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";
import Bar from "./components/Bar";
import { Box } from '@material-ui/core';
import Slideshow from "./components/Slideshow";
import ControlPanel from "./components/ControlPanel/ControlPanel"
function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
            <Route exact path="/">
              <Box height="99.77vh" alignItems="center">
                <Slideshow />
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
