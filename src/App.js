import 'webrtc-adapter';
import React, { Component, Fragment } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import ContainerDimensions from 'react-container-dimensions';
import Webcam from './container/Webcam';
import VideoContainer from './container/VideoContainer';
import Heading from './presentational/Heading';
import styles from './App.module.css';

class App extends Component {
  state = {
    videoPlaying: false,
    headingHeight: 0
  }

  onHeadingResize = ({ height }) => {
    this.setState({
      headingHeight: height
    });
  }

  onVideoPlayingStart = () => {
    this.setState({
      videoPlaying: true
    });
  }

  render() {
    return (
      <div className={styles.container} style={
        this.state.videoPlaying ? ({
          backgroundColor: "#121212",
          color: "#cd0507"
        }) : ({})
      }>
        <ContainerDimensions>
        {({ width, height }) => {
          const videoContainerHeight = height - (this.state.videoPlaying ? 
            this.state.headingHeight : 0);
          return (<Fragment>
            <Heading
              containerWidth={width}
              onResize={this.onHeadingResize}
              style={{
                height: this.state.headingHeight,
                visibility: this.state.videoPlaying ? 'visible' : 'hidden'
              }}
            />
            <div style={{
              position: 'absolute',
              width: '100%',
              height: videoContainerHeight,
              top: this.state.videoPlaying ? this.state.headingHeight : 0,
            }}> 
              <Webcam>
                {({ loading, error, stream }) =>
                  <VideoContainer 
                    loading={loading}
                    error={error}
                    stream={stream}
                    onVideoPlayingStart={this.onVideoPlayingStart}
                    width={width}
                    height={videoContainerHeight}
                  />
                }
              </Webcam>
            </div>
          </Fragment>);
        }}
        </ContainerDimensions>
      </div>
    )
  }
}

const ThemedApp = () =>
  <MuiThemeProvider>
    <App />
  </MuiThemeProvider>

export default ThemedApp;
