import React, { useState, useEffect, useContext } from 'react'
import {TimerState} from '../../types/index';
// import './PomodoroBar.module.scss';
import { CharacterContext } from '../../services/CharacterContext';
import { MessageContext } from  '../../services/MessageContext';

interface PomodoroBarProps extends TimerState {
    isEditable: boolean;
}

type IntervalChangeScenario = 'startWork' | 'startRest' | 'startBreak';

const intervalChangeConfig: Record<IntervalChangeScenario, {gifSrc: string; soundSrc: string, videoSrc: string }> = {
  startWork: {
    gifSrc: '/assets/gif/chiikawa_op.gif',
    soundSrc: '/assets/music/chiikawa_op.mp3',
    videoSrc: '/assets/video/chiikawa_op.mp4',
  },
  startRest: {
    gifSrc: '/assets/gif/sukiyaki.gif',
    soundSrc: '/assets/music/sukiyaki.mp3',
    videoSrc: '/assets/video/sukiyaki.mp4',
  },
  startBreak: {
    gifSrc: '/assets/gif/usagi_pajama.gif',
    soundSrc: '/assets/music/usagi_pajama.mp3',
    videoSrc: '/assets/video/usagi_pajama.mp4',
  },

};
  // Add more scenarios as needed

interface IntervalChangePopupProps {
  scenario: IntervalChangeScenario;
  showPopup: boolean;
}

const playSound = (audioPath: string, volume = 0.5) => {
  const audio = new Audio(audioPath);
  audio.volume = volume;
  audio.play().catch(error => {
    console.error('Error playing sound:', error);
  });
};

const IntervalChangePopup:React.FC<IntervalChangePopupProps>= ({ scenario, showPopup  }) => {

  const config = intervalChangeConfig[scenario];
  const { gifSrc,soundSrc } = config;

  useEffect(() => {
    if (showPopup) {
      playSound(soundSrc);
    }
  }, [showPopup,soundSrc]);
  // useEffect(() => {
  //   const audio = new Audio(soundSrc);
  //   audio.play().catch((error) => {
  //   });
  // }, [soundSrc]);

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
      maxwidth: '80%',
      maxHeight: '80%',
      backgroundColor: 'white',
      borderRadius: '10px',
      padding: '5px',
      border: '3px solid black',
      transition: 'width 1s linear, backgroundColor 1s linear',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      // overflow: 'hidden',
      // animation: 'openTv 1s linear forwards',
    },
    video: {
      maxWidth: '100%',
      maxHeight: '100%',
    },
    image: {
      maxWidth: '100%',
      maxHeight: '100%',
    },
    '@keyframes openTv': {
    '0%': {
      height: '0%',
      transform: 'scaleY(0)',
    },
    '100%': {
      maxheight: '100%',
      transform: 'scaleY(1)',
    },
  },
    
  };

  return (
    <div style={styles.overlay}>
      {/* <div style={styles.videoContainer}> */}
        {/* <video id="popup-video" autoPlay playsInline style={styles.video} preload="auto">
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video> */}
        {/* <img src="/assets/chiikawa-usagi-animated.gif" alt="GIF" style={{ maxWidth: "100%", maxHeight: "100%" }} /> */}
        <img src={gifSrc} alt="Interval Change" style={styles.image} />
        {/* </div> */}
        {/* <style>
        {`
          @keyframes openTv {
            0% {
              height: 0%;
              transform: scaleY(0);
            }
            100% {
              maxheight: 100%;
              transform: scaleY(1);
            }
          }
        `}
      </style> */}
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
    const [prevIntervalIndex, setPrevIntervalIndex] = useState<number>(999);

    const [currentScenario, setCurrentScenario] = useState<IntervalChangeScenario>('startRest');

    const { state } = useContext(CharacterContext);
    const { dispatch } = useContext(MessageContext);

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

      const getCurrentIntervalRemainingMinuteSecond = () => {
        // Calculate the end time of the current interval
        let currentIndex = getCurrentIntervalIndex();
        let intervalEndTime = intervalChangeTimes[currentIndex];

        // Calculate the remaining time in seconds for the current interval
        let remainingTimeInSeconds = intervalEndTime - elapsedTimeInSeconds;

        // Convert remaining time to minutes and seconds
        const remainingMinutes = Math.floor(remainingTimeInSeconds / 60);
        const remainingSeconds = remainingTimeInSeconds % 60;

        return { remainingMinutes, remainingSeconds };
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
            dispatch({ type: 'WORK_STAGE' });
    
            if (previousIntervalType === 'rest' && currentIntervalType === 'work') {
              scenario = 'startWork';
              dispatch({ type: 'WORK_STAGE' });
            } else if (previousIntervalType === 'work' && currentIntervalType === 'rest') {
              scenario = 'startRest';
              dispatch({ type: 'REST_STAGE' });
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
        }else {
          // Update the document title with the current interval type within square brackets time
          const { remainingMinutes, remainingSeconds }  = getCurrentIntervalRemainingMinuteSecond();
          document.title = `[${remainingMinutes}:${remainingSeconds}][${capitalizeFirstWord(intervalTypes[currentIntervalIndex])}] Chiikawa Timer`;
        }
       
      }, [isEditable, totalTimeInSeconds]);

    const capitalizeFirstWord = (str:string) => {
      return str.charAt(0).toUpperCase() + str.slice(1);
    };

    useEffect(() => {
      if (isEditable){
        setPrevIntervalIndex(999);
        if ( totalTimeInSeconds === 0) {
          setCurrentScenario('startBreak');
          dispatch({ type: 'BEFORE_TIMER_START' });
          setShowPopup(true);
    
          const popupTimeout = setTimeout(() => {
            setShowPopup(false);
            setCurrentScenario('startWork'); // Reset scenario after pop-up hides
            
          }, 10000);
    
          // Cleanup the timeout
          return () => clearTimeout(popupTimeout);
        }
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
          marginTop: '0px',
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
          // backgroundColor: '#FFF1CB9A',
          backgroundColor:`${state.selectedCharacter.color}4A`,
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
       {showPopup && <IntervalChangePopup scenario={currentScenario} showPopup={showPopup}/>}
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
                src={state.selectedCharacter.imgSrc}
                alt="Moving"
                style={styles.movingImage}
              />
        </div>
        {/* <p>{intervalTypes[currentIntervalIndex]}</p> */}
        </>
      );
}

export default PomodoroBar;