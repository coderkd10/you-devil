import React, { Component } from 'react';
import classNames from 'classnames';
import ScaleLoader from 'react-spinners/dist/spinners/ScaleLoader';
import OrigErrorIcon from 'react-icons/lib/md/error';
import styles from './VideoPlayer.module.css';
import makeSizable from '../shared/SizedIcon';

const ErrorIcon = makeSizable(OrigErrorIcon);

export default class VideoPlayer extends Component {
    state = {
        videoLoading: true
    };

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

    render() {
        const { error, loading } = this.props;
        return <div className={classNames(styles.container, styles.center)}>
            {(loading || this.state.videoLoading)?
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
                (<div className={styles.center}>
                    <video 
                        className={classNames(styles.video)}
                        muted
                        ref={ref => this.video = ref}
                        style={{
                            visibility: this.state.videoLoading ? 'hidden' : 'visible'
                        }}
                    />
                    <button>Take Screenshot</button>
                </div>) : null
            }
        </div>
    }
}
