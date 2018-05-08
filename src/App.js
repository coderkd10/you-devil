import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import 'webrtc-adapter';
import Webcam from './container/Webcam';
import VideoPlayer from './presentational/VideoPlayer';
import styles from './App.module.css';
import url from './assets/chruch-of-satan.gif';
import Heading from './presentational/Heading';

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
        {/* {this.state.videoPlaying ? (<div className={styles.heading}>
          <div style={{
            display: "inline-block",
            whiteSpace: "nowrap"
          }}>
            <img className={styles.headingIcon} src={url} />
            <div className={styles.headingText}>You Devil</div>
            <img className={styles.headingIcon} src={url} />
          </div>
        </div>) : null} */}
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
