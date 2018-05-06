import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

class App extends Component {
  render() {
    return null; //TODO
  }
}

const ThemedApp = () =>
  <MuiThemeProvider>
    <App />
  </MuiThemeProvider>

export default ThemedApp;
