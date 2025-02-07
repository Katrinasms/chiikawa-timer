import React, { useState, useEffect } from 'react'
import {TimerState} from '../../types/index';

interface PomodoroBarProps extends TimerState {
    isEditable: boolean;
}

type IntervalChangeScenario = 'startWork' | 'startRest' | 'startBreak';

const intervalChangeConfig: Record<IntervalChangeScenario, { gifSrc: string; soundSrc: string }> = {
  startWork: {
    gifSrc: '/assets/gif/group-jumping.webp',
    soundSrc: '/assets/music/start_work_chi.mp3',
  },
  startRest: {
    gifSrc: '/assets/gif/group-sukiyaki.gif',
    soundSrc: '/assets/music/usagi_happy_sounds.mp3',
  },
  startBreak: {
    gifSrc: '/assets/start-rest.gif',
    soundSrc: '/assets/sounds/start-rest.mp3',
  },

};
  // Add more scenarios as needed

interface IntervalChangePopupProps {
  scenario: IntervalChangeScenario;
}

const IntervalChangePopup:React.FC<IntervalChangePopupProps>= ({ scenario }) => {

  const config = intervalChangeConfig[scenario];
  const { gifSrc, soundSrc } = config;

  // Play sound when component mounts
  useEffect(() => {
    const audio = new Audio(soundSrc);
    audio.play().catch((error) => {
      console.error('Error playing sound:', error);
    });
  }, [soundSrc]);

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
    image: {
      maxWidth: '100%',
      maxHeight: '100%',
    },
  };

  return (
    <div style={styles.overlay}>
      <img src={gifSrc} alt="Interval Change" style={styles.image} />
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

    const [currentScenario, setCurrentScenario] = useState<IntervalChangeScenario>('startWork');

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

      // Detect interval changes
    useEffect(() => {
      if (!isEditable) {
        if (totalTimeInSeconds === 0) {
          setShowPopup(false);
          setPrevIntervalIndex(0);
          return;
        };
        console.log('Current Interval Index:', currentIntervalIndex);
        if (currentIntervalIndex !== prevIntervalIndex && currentIntervalIndex !== 0) {
          // Interval has changed
          setPrevIntervalIndex(currentIntervalIndex);

          // Show the pop-up
          setShowPopup(true);

          // Hide the pop-up after 5 seconds
          const popupTimeout = setTimeout(() => {
            setShowPopup(false);
          }, 500);

          // Cleanup the timeout
          return () => clearTimeout(popupTimeout);
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [currentIntervalIndex, isEditable]);
    
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
        // eslint-disable-next-line react-hooks/exhaustive-deps


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
        {/* <p>{}</p> */}
        </>
      );
}

export default PomodoroBar;