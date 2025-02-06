import React, { useState, useEffect } from 'react'
import {TimerState} from '../../types/index';

interface PomodoroBarProps extends TimerState {
    isEditable: boolean;
}

const PomodoroBar: React.FC<PomodoroBarProps> = ({
    hours,
    minutes,
    seconds,
    isEditable}) => {

    const totalTimeInSeconds = hours * 3600 + minutes * 60 + seconds;

    const [initialTimeinSecond, setInitialTimeinSecond] = useState(totalTimeInSeconds);
    const [imagePosition, setImagePosition] = useState(0);

    const workInterval = 25; // minutes
    const restInterval = 5;  // minutes
    const cycleDuration = workInterval + restInterval; // minutes

    // Calculate total number of full cycles
    const totalCycles = Math.floor(initialTimeinSecond / 60 / cycleDuration);
    const remainingMinutes = initialTimeinSecond / 60 % cycleDuration;

    const bars = [];

    for (let i = 0; i < totalCycles; i++) {
        bars.push({ type: 'work', duration: workInterval });
        bars.push({ type: 'rest', duration: restInterval });
    }

    // Handle the remaining time
    if (remainingMinutes > 0) {
        if (remainingMinutes >= workInterval) {
          bars.push({ type: 'work', duration: workInterval });
          const restTime = remainingMinutes - workInterval;
          if (restTime > 0) {
            bars.push({ type: 'rest', duration: restTime });
          }
        } else {
          bars.push({ type: 'work', duration: remainingMinutes });
        }
      }
    
    // Total width for scaling
    const totalBarWidth = bars.reduce((sum, bar) => sum + bar.duration, 0);

    useEffect(() => {
        if (isEditable) {
          setInitialTimeinSecond(totalTimeInSeconds);
        }
      }, [isEditable, totalTimeInSeconds]);

    // Update progress and image position when elapsedTime changes
    useEffect(() => {
        const progress = (totalTimeInSeconds/initialTimeinSecond) * 100;
        const clampedProgress = Math.min(Math.max(progress, 0), 100);
        setImagePosition(clampedProgress);
    }, [totalTimeInSeconds, initialTimeinSecond]);

  // Styles
    const styles = {
        barContainer: {
          display: 'flex',
          alignItems: 'center' as 'center',
          position: 'relative' as 'relative',
          width: '100%',
          height: '40px',
          marginTop: '20px',
        } as React.CSSProperties,
        barsWrapper: {
          position: 'relative',
          width: '100%',
          height: '10px',
          display: 'flex',
          overflow: 'hidden', // Ensures overlay doesn't spill out
        } as React.CSSProperties,
        bar: (widthPercentage: number, type: string):React.CSSProperties => ({
          width: `${widthPercentage}%`,
          height: '10px',
          backgroundColor: type === 'work' ? '#D9D9D9' : '#7BABC4',
          marginRight: '2px',
          position: 'relative' as 'relative',
          borderRadius: '5px',
        }),
        overlayBar: (imagePosition: number):React.CSSProperties => ({
          position: 'absolute',
          top: '0',
          left: '0',
          height: '10px',
          width: `${100 - imagePosition}%`,
          backgroundColor: 'rgba(204, 131, 195, 0.66)', // Gray with 50% opacity
          borderRadius: '5px',
          pointerEvents: 'none', // Allow clicks to pass through
          transition: 'width 1s linear',
          zIndex: '1'
        }),
        gap: {
          width: '5px',
        } as React.CSSProperties,
        movingImage: {
          position: 'absolute' as 'absolute',
          left: `${100 - imagePosition}%`,
          top: '-8px',
          transform: 'translateX(-50%)',
          transition: 'left 1s linear',
          width: '40px',
          height: '40px',
          zIndex: '2'
        } as React.CSSProperties,
    };

    return (
        <div style={styles.barContainer}>
          {/* Render the bars */}
          <div style={styles.barsWrapper}>
            {bars.map((bar, index) => {
              const widthPercentage = (bar.duration / totalBarWidth) * 100;
              return (
                <>
                  <div key={index} style={styles.bar(widthPercentage, bar.type)}></div>
                </>
              );
            })}
            <div style={styles.overlayBar(imagePosition)}></div>
          </div>
              <img
                src="/assets/YahaUsagi.webp"
                alt="Moving"
                style={styles.movingImage}
              />
        </div>
      );
}

export default PomodoroBar;