import React from 'react';
import PropTypes from 'prop-types';
import AutoScale from '../shared/AutoScale';
import url from '../assets/chruch-of-satan.gif';
import styles from './Heading.module.css';

const Logo = () => 
    <div className={styles.headingLogo}>
        <img alt='' className={styles.logoIcon} src={url} />
        <div className={styles.logoText}>You Devil</div>
        <img alt='' className={styles.logoIcon} src={url} />
    </div>

const Heading = ({ containerWidth, style, onResize }) =>
    <div className={styles.headingContainer} style={style}>
        <AutoScale 
            containerWidth={containerWidth}
            render={() => 
                <Logo />
            }
            onResize={onResize}
        />
    </div>

Heading.propTypes = {
    containerWidth: PropTypes.number.isRequired,
    style: PropTypes.object,
    onResize: PropTypes.func,
};

Heading.defaultProps = {
    style: {},
    onResize: () => {},
};

export default Heading;
