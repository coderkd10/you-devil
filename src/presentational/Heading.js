import React from 'react';
import makeXScaled from '../shared/XScaledComponent';
import url from '../assets/chruch-of-satan.gif';
import styles from './Heading.module.css';

const HeadingLogo = () => 
    <div className={styles.headingLogo}>
        <img className={styles.logoIcon} src={url} />
        <div className={styles.logoText}>You Devil</div>
        <img className={styles.logoIcon} src={url} />
    </div>

const ScaledLogo = makeXScaled(HeadingLogo);

const Heading = () =>
    <div className={styles.headingContainer}>
        <ScaledLogo />
    </div>


export default Heading;

