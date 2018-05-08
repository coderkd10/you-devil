import React from 'react';
import ContainerDimensions from 'react-container-dimensions';
import HorizontalAutoScale from '../shared/HorizontalAutoScale';
import url from '../assets/chruch-of-satan.gif';
import styles from './Heading.module.css';

const Logo = () => 
    <div className={styles.headingLogo}>
        <img alt='' className={styles.logoIcon} src={url} />
        <div className={styles.logoText}>You Devil</div>
        <img alt='' className={styles.logoIcon} src={url} />
    </div>

const Heading = () =>
    <div className={styles.headingContainer}>
        <ContainerDimensions>
        {({ width }) =>
            <HorizontalAutoScale 
                containerWidth={width}
                render={() => 
                    <Logo />
                }
            />
        }
        </ContainerDimensions>
    </div>

export default Heading;
