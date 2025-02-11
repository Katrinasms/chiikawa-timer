import React, { useState, useEffect, useRef } from 'react'
import {TimerState} from '../../types/index';
import './PomodoroBar.module.scss';


interface PomodoroBarProps extends TimerState {
    isEditable: boolean;
}

type IntervalChangeScenario = 'startWork' | 'startRest' | 'startBreak';

const intervalChangeConfig: Record<IntervalChangeScenario, { videoSrc: string }> = {
  startWork: {
    videoSrc: '/assets/video/chiikawa_op.mp4',
  },
  startRest: {
    videoSrc: '/assets/video/sukiyaki.mp4',
  },
  startBreak: {
    videoSrc: '/assets/video/usagi_pajama.mp4',
  },

};
  // Add more scenarios as needed

interface IntervalChangePopupProps {
  scenario: IntervalChangeScenario;
}

const IntervalChangePopup:React.FC<IntervalChangePopupProps>= ({ scenario }) => {

  const config = intervalChangeConfig[scenario];
  const { videoSrc } = config;

  const styles = {
    overlay: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
    },
    videoContainer:{
      width: '80%',
      maxHeight: '80%',
      backgroundColor: 'white',
      borderRadius: '10px',
      padding: '5px',
      border: '3px solid black',
      // overflow: 'hidden', // Ensure content doesn't overflow during animation
      // transition: 'width 1s linear, backgroundColor 1s linear'
      overflow: 'hidden',
      animation: 'openTv 1s linear forwards',
    },
    video: {
      maxWidth: '100%',
      maxHeight: '100%',
    },
    '@keyframes openTv': {
    '0%': {
      height: '0%',
      transform: 'scaleY(0)',
    },
    '100%': {
      height: '100%',
      transform: 'scaleY(1)',
    },
  },
    
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.videoContainer}>
        <video autoPlay playsInline style={styles.video}>
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        </div>
    </div>
  );
};


const PomodoroBar: React.FC<PomodoroBarProps> = ({
    hours,
    minutes,
    seconds,
    isEditable}) => {

    const totalTimeInSeconds = hours * 3600 + minutes * 60 + seconds;

    const [initialTimeinSecond, setInitialTimeinSecond] = useState(totalTimeInSeconds);
    const [imagePosition, setImagePosition] = useState(0);
    const [showPopup, setShowPopup] = useState(false);
    const [prevIntervalIndex, setPrevIntervalIndex] = useState<number>(0);

    const [currentScenario, setCurrentScenario] = useState<IntervalChangeScenario>('startRest');

    // Calculate elapsed time
    const elapsedTimeInSeconds = initialTimeinSecond - totalTimeInSeconds;
  
    const workInterval = 25; // minutes
    const restInterval = 5;  // minutes
    const cycleDuration = workInterval + restInterval; // minutes

    // Calculate total number of full cycles
    const totalCycles = Math.floor(initialTimeinSecond / 60 / cycleDuration);
    const remainingMinutes = initialTimeinSecond / 60 % cycleDuration;

    const bars:any[] = [];

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

    // for pop animation
    const intervalChangeTimes: number[] = [];
    const intervalTypes: ('work' | 'rest')[] = [];

    // Initialize cumulative time
    let cumulativeTime = 0;

    // Populate the arrays using the existing bars
    bars.forEach((bar) => {
      cumulativeTime += bar.duration * 60; // Convert minutes to seconds
      intervalChangeTimes.push(cumulativeTime);
      intervalTypes.push(bar.type);
    });
    

      // Calculate elapsed time

      // Function to find the current interval index
      const getCurrentIntervalIndex = () => {
        for (let i = 0; i < intervalChangeTimes.length; i++) {
          if (elapsedTimeInSeconds < intervalChangeTimes[i]) {
            return i;
          }
        }
        return intervalChangeTimes.length - 1; // In case elapsed time exceeds total time
      };

      const currentIntervalIndex = getCurrentIntervalIndex();
    
      useEffect(() => {
        if (!isEditable) {
            if (currentIntervalIndex !== prevIntervalIndex) {
            // Interval has changed
            setPrevIntervalIndex(currentIntervalIndex);
    
            // Determine the scenario based on the interval change
            const previousIntervalType = intervalTypes[prevIntervalIndex];
            const currentIntervalType = intervalTypes[currentIntervalIndex];
    
            let scenario: IntervalChangeScenario = 'startWork';
    
            if (previousIntervalType === 'rest' && currentIntervalType === 'work') {
              scenario = 'startWork';
            } else if (previousIntervalType === 'work' && currentIntervalType === 'rest') {
              scenario = 'startRest';
            }
    
            if (scenario) {
              setCurrentScenario(scenario);
    
              // Show the pop-up
              setShowPopup(true);
    
              // Hide the pop-up after 5 seconds
              const popupTimeout = setTimeout(() => {
                setShowPopup(false);
                setCurrentScenario('startWork'); // Reset scenario after pop-up hides
              }, 5000);
    
              // Cleanup the timeout
              return () => clearTimeout(popupTimeout);
            }
          }
        }}, [currentIntervalIndex, isEditable]);


    useEffect(() => {
        if (isEditable) {
          setInitialTimeinSecond(totalTimeInSeconds);
        }
      }, [isEditable, totalTimeInSeconds]);

    useEffect(() => {
      if (isEditable && totalTimeInSeconds === 0) {
        setCurrentScenario('startBreak');
        setShowPopup(true);
  
        const popupTimeout = setTimeout(() => {
          setShowPopup(false);
          setCurrentScenario('startWork'); // Reset scenario after pop-up hides
        }, 10000);

        // Cleanup the timeout
        return () => clearTimeout(popupTimeout);
      }
    }, [isEditable]);

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
          backgroundColor: '#FFF1CB9A', // Gray with 50% opacity rgba(253, 199, 206, 0.5)
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
      <>
       {showPopup && <IntervalChangePopup scenario={currentScenario} />}
       {/* <IntervalChangePopup scenario={currentScenario} /> */}
        <div style={styles.barContainer}>
          
          {/* Render the bars */}
          <div style={styles.barsWrapper}>
            {bars.map((bar, index) => {
              const widthPercentage = (bar.duration / totalBarWidth) * 100;
              return (
                  <div key={index} style={styles.bar(widthPercentage, bar.type)}></div>
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
        <p>{intervalTypes[currentIntervalIndex]}</p>
        </>
      );
}

export default PomodoroBar;