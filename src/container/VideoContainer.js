import React, { Component } from 'react';
import PropTypes from 'prop-types';
import downloadjs from 'downloadjs';
import ScaleLoader from 'react-spinners/dist/spinners/ScaleLoader';
import OrigErrorIcon from 'react-icons/lib/md/error';
import VideoPlayer from '../presentational/VideoPlayer';
import makeSizable from '../shared/SizedIcon';
import AutoScale from '../shared/AutoScale';
import videoToImg from '../utils/video-to-img';
import styles from './VideoContainer.module.css';

const ErrorIcon = makeSizable(OrigErrorIcon);

class VideoContainer extends Component {
    state = {
        videoLoading: true,
        videoHeight: null,
    };

    downloadImage = () => {
        const img = videoToImg(this.video, {
            filter: 'invert(1)', 
            mimeType: 'imaage/png'
        });
        downloadjs(img, 'you-devil.png', 'image/png');
    }

    componentDidUpdate(prevProps, prevState) {        
        // check if stream has updated
        // if yes then play the video
        if (this.props.stream !== prevProps.stream) {
            const { error, loading, stream } = this.props;
            if (!error && !loading) {
                this.video.srcObject = stream;
                this.setState({ videoLoading: true });
                this.video.play().then(() => {
                    this.setState({ videoLoading: false });
                    this.props.onVideoPlayingStart();
                });
            }
        }
    }

    onVideoResize = ({ height, width }) => {
        this.setState({
            videoHeight: height,
        });
    }

    getVideoTop() {
        const { videoHeight } = this.state;
        if (!videoHeight)
            return 0;
        const containerHeight = this.props.height;
        const diff = containerHeight - videoHeight;
        return 0.35*diff;
    }

    render() {
        const { error, loading, height, width } = this.props;
        const showingLoading = !error && (loading || this.state.videoLoading);

        return <div className={styles.container} 
            style={{
                height,
                width,
            }}>
            {showingLoading ?
                (<div className={styles.center}>
                    <ScaleLoader 
                        height={30}
                        margin='2px'
                        radius={2}
                        width={4}
                    />
                </div>) : null
            }
            {error ?
                (<div className={styles.center}>
                    <ErrorIcon width={160} style={{ color: '#b60000' }}/>
                    <div className={styles.errorText}>Unable to load video</div>
                </div>) : null
            }
            {(!error && !loading) ?
                (<AutoScale
                    style={{
                        position: 'absolute',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        marginTop: this.getVideoTop(),
                    }}
                    containerWidth={width}
                    containerHeight={height}
                    render={() => 
                        <VideoPlayer
                            style={{
                                visibility: this.state.videoLoading ? 'hidden' : 'visible'                        
                            }}
                            videoRef={ref => this.video = ref}
                            videoMaxWidth={width}
                            videoMaxHeight={height}
                            onDownloadClick={this.downloadImage}
                        />
                    }
                    onResize={this.onVideoResize}
                />) : null
            }
        </div>
    }
}

VideoContainer.propTypes = {
    error: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    stream: PropTypes.object,
    onVideoPlayingStart: PropTypes.func,

    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
};

VideoContainer.defaultProps = {
    stream: null,
    onVideoPlayingStart: () => {},
}

export default VideoContainer;
