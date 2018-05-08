import 'webrtc-adapter';
import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Webcam from './container/Webcam';
import VideoPlayer from './presentational/VideoPlayer';
import Heading from './presentational/Heading';
import styles from './App.module.css';

class App extends Component {
  state = {
    videoPlaying: false,
  }

  onVideoPlayingStart = () => {
    this.setState({
      videoPlaying: true
    })
  }

  render() {
    return (
      <div className={styles.container} style={
        this.state.videoPlaying ? ({
          backgroundColor: "#121212",
          color: "#cd0507"
        }) : ({})
      }>
        {this.state.videoPlaying ? <Heading /> : null}
        <div>
          <Webcam>
            {({ loading, error, stream }) =>
              <VideoPlayer 
                loading={loading}
                error={error}
                stream={stream}
                onVideoPlayingStart={this.onVideoPlayingStart}
              />
            }
          </Webcam>
        </div>
      </div>
    )
  }
}

const ThemedApp = () =>
  <MuiThemeProvider>
    <App />
  </MuiThemeProvider>

export default ThemedApp;
