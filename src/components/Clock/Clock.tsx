import React, { useEffect, useState, CSSProperties } from 'react';
import styles from './Clock.module.scss';

interface Styles {
    container: CSSProperties;
    spinner: CSSProperties;
}

interface ClockProps {
    seconds: number; // Accept seconds as a prop
}


const Clock: React.FC<ClockProps> = ({ seconds }) => {
    const rotation = seconds * 6;

    const styles_animated: Styles = {
        container: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            backgroundColor: '#f0f0f0'
        },
        spinner: {
            transform: `rotate(${rotation}deg)`,
            transition: 'transform 1s linear'
        }
    };
    return(
    <div className={styles.cornerImage} >
        <img src={('./src/assets/Timer.png')} className={styles.timerImage}/>
        <img src={('./src/assets/clock.png')} className={styles.smallImage} style={styles_animated.spinner}/>
    </div>
    )
}

export default Clock;