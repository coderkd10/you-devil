import React from 'react';
import PropTypes from 'prop-types';
import styles from './VideoPlayer.module.css';

const VideoPlayer = ({ videoRef, style, videoMaxWidth, videoMaxHeight }) => (
    <div className={styles.container} style={style}>
        <video 
            className={styles.video}
            muted
            ref={videoRef}
            style={{
                maxWidth: videoMaxWidth,
                maxHeight: videoMaxHeight,
            }}
        />
        <button className={styles.button}>Take Screenshot</button>
    </div>);

VideoPlayer.propTypes = {
    style: PropTypes.object,
    videoMaxWidth: PropTypes.number,
    videoMaxHeight: PropTypes.number,
    videoRef: PropTypes.func,
};

VideoPlayer.defaultProps = {
    style: {},
    videoMaxWidth: null,
    videoMaxHeight: null,
    videoRef: null,
};

export default VideoPlayer;
