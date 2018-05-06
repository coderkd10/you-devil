import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import 'webrtc-adapter';
import Webcam from './container/Webcam';
import VideoPlayer from './presentational/VideoPlayer';
import styles from './App.module.css';

class App extends Component {
  render() {
    return (
      <div className={styles.container}>
        <Webcam>
          {({ loading, error, stream }) =>
            <VideoPlayer 
              loading={loading}
              error={error}
              stream={stream}
            />
          }
        </Webcam>
      </div>
    )
  }
}

const ThemedApp = () =>
  <MuiThemeProvider>
    <App />
  </MuiThemeProvider>

export default ThemedApp;
