import React from 'react';
import ContainerDimensions from 'react-container-dimensions';
import HorizontalAutoScale from '../shared/XScaledComponent';
import url from '../assets/chruch-of-satan.gif';
import styles from './Heading.module.css';

const HeadingLogo = () => 
    <div className={styles.headingLogo}>
        <img className={styles.logoIcon} src={url} />
        <div className={styles.logoText}>You Devil</div>
        <img className={styles.logoIcon} src={url} />
    </div>

const Heading = () =>
    <div className={styles.headingContainer}>
        <ContainerDimensions>
        {({ width }) =>
            <HorizontalAutoScale 
                containerWidth={width}
                render={() => 
                    <HeadingLogo />
                }
            />
        }
        </ContainerDimensions>
    </div>


export default Heading;

