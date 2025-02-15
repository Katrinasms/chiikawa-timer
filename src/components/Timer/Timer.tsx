import React, { useState,useRef,useEffect } from 'react';
import styles from './Timer.module.scss';
import {TimerState} from '../../types/index';
import { TimerService } from '../../services/TimerService';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Clock from '../Clock/Clock';
import PomodoroBar from '../PomodoroBar/PomodoroBar';

interface TimerProps {
  initialHours?: number;
  initialMinutes?: number;
  initialSeconds?: number;
}

// const PopUpAnimate: React.FC = () => {
//   const [isVisible, setIsVisible] = useState(true);

//   useEffect(() => {
//       // Hide the overlay after 8 seconds
//       const timer = setTimeout(() => {
//           setIsVisible(false);
//       }, 5000);

//       // Cleanup the timer on component unmount
//       return () => clearTimeout(timer);
//   }, []);

//   if (!isVisible) return null; // Don't render anything if the overlay is hidden

//   return (
//       <div
//           style={{
//               position: "fixed",
//               top: 0,
//               left: 0,
//               width: "100%",
//               height: "100%",
//               backgroundColor: "rgba(0, 0, 0, 0.5)", // Black with 0.5 opacity
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//               zIndex: 1000, // Ensure it's on top
//           }}
//       >
//           <img src="/assets/chiikawa-usagi-animated.gif" alt="GIF" style={{ maxWidth: "100%", maxHeight: "100%" }} />
//       </div>
//   );
// };

const Timer: React.FC<TimerProps> = ({
  initialHours = 0,
  initialMinutes = 0,
  initialSeconds = 10
}) => {

  const [timerState, setTimerState] = useState<TimerState>({
      hours: initialHours,
      minutes: initialMinutes,
      seconds: initialSeconds,
      isRunning: false
  });

  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isEditable, setIsEditable] = useState<boolean>(true); 
  // const [isComplete, setIsComplete] = useState<boolean>(false); 

  const timerServiceRef = useRef<TimerService | null>(null);

  const incrementHourTime = (): void => {    
      setTimerState(prev => ({
          ...prev,
          hours: prev.hours === 8? 0 :prev.hours  + 1,
          }));
      };

  const incrementMinuteTime = (): void => {
      setTimerState(prev => ({
          ...prev,
          minutes: prev.minutes === 50? 10 : prev.minutes + 10,
          hours: prev.minutes === 50 && prev.hours < 8 ? prev.hours + 1 : prev.hours
          }));
  };
          
  const decrementHourTime = (): void => {    
      setTimerState(prev => ({
          ...prev,
          hours: prev.hours === 0? 8 :prev.hours  - 1,
          }));
      };

  const decrementMinuteTime = (): void => {
      setTimerState(prev => ({
          ...prev,
          minutes: prev.minutes === 0? 50 : prev.minutes - 10,
          hours: prev.minutes === 0 && prev.hours > 0 ? prev.hours - 1 : prev.hours
          }));
  };

  const startTimer = (): void => {
      timerServiceRef.current = new TimerService(timerState.hours, timerState.minutes,timerState.seconds);
          timerServiceRef.current.start(
          (hours, minutes,seconds) => {
              setTimerState(prev => ({
              ...prev,
              hours,
              minutes,
              seconds
              }));
          },
          () => {
              setTimerState(prev => ({
              ...prev,
              isRunning: false
              }));
              
              setIsEditable(true); 
              setIsPaused(false);
              // setIsComplete(true);
              // playSound('/assets/music/start_work_chi.mp3')

          }
          );
          setTimerState(prev => ({
              ...prev,
              isRunning: true
          }));
          setIsEditable(false); // Disable editing when timer starts
          setIsPaused(false);
          // setIsComplete(false);

  };

  const pauseTimer = (): void => {
    if (timerServiceRef.current) {
      timerServiceRef.current.pause();
      setTimerState(prev => ({
        ...prev,
        isRunning: false
      }));
      setIsPaused(true);
    }
  };

  const resumeTimer = (): void => {
    if (timerServiceRef.current) {
      timerServiceRef.current.resume();
      setTimerState(prev => ({
        ...prev,
        isRunning: true
      }));
      setIsPaused(false);
    }
  };

  // Reset timer
  const resetTimer = (): void => {
    if (timerServiceRef.current) {
      timerServiceRef.current.reset(initialHours, initialMinutes,initialSeconds );
      
    }
    setTimerState({
      hours: initialHours,
      minutes: initialMinutes,
      seconds: initialSeconds,
      isRunning: false
    });
    setIsEditable(true); // Allow editing after reset
    setIsPaused(false); 
    document.title = 'Chiikawa Timer';
  };

  useEffect(() => {
    if (isEditable && timerState.hours === 0 && timerState.minutes === 0 && timerState.seconds === 0) {
      resetTimer();
    }
    console.log('Timer state updated:', timerState);
    console.log('IsEditable:', isEditable);
  }, [isEditable, timerState.hours, timerState.minutes, timerState.seconds]);

  useEffect(() => {
    if (isEditable) {
      document.title = 'Chiikawa Timer'; 
    }
  }, [isEditable]);
  

useEffect(() => {
    return () => {
      if (timerServiceRef.current) {
        timerServiceRef.current.pause();
      }
    };
  }, []);


return (
<div className={`${styles.timerContainer} ${timerState.isRunning ? styles.shrunk : ''}`}>
    <div className={styles.timerDisplay}>
        <div className={styles.centerBox}>
               <button 
               className={`${styles.arrowButton} ${!isEditable ? styles.hidden : ''} ${!isEditable ? styles.entering : styles.exiting}`}
               onClick={incrementHourTime}
               disabled={timerState.isRunning}
               aria-label="Increase time"
               >
               <KeyboardArrowUpIcon className={styles.arrowFont} />
           </button>

        <div className={styles.time}>
            {String(timerState.hours).padStart(2)}
        </div>    
               <button 
        
               className={`${styles.arrowButton} ${!isEditable ? styles.hidden : ''} ${!isEditable ? styles.entering : styles.exiting}`}
               onClick={decrementHourTime}
               disabled={timerState.isRunning}
               >
                   <KeyboardArrowDownIcon className={styles.arrowFont} />
               </button>
        </div>
        <div className={styles.time}>
            :
        </div>
        <div className={styles.centerBox}>
        <button 
               className={`${styles.arrowButton} ${!isEditable ? styles.hidden : ''} ${!isEditable ? styles.entering : styles.exiting}`}
               onClick={incrementMinuteTime}
               disabled={timerState.isRunning}
               aria-label="Increase time"
               >
               <KeyboardArrowUpIcon className={styles.arrowFont} />
           </button>
        <div className={styles.time}>
            {String(timerState.minutes).padStart(2, '0')}
        </div>    
               <button 
               className={`${styles.arrowButton} ${!isEditable ? styles.hidden : ''} ${!isEditable ? styles.entering : styles.exiting}`}
               onClick={decrementMinuteTime}
               disabled={timerState.isRunning}
               >
                   <KeyboardArrowDownIcon className={styles.arrowFont} />
               </button>
        </div>
    </div>
        <Clock seconds={timerState.seconds}/>
       {timerState.isRunning ? (
        <div className={styles.controlButtons}>
          <button
            className={styles.pauseButton}
            onClick={pauseTimer}
          >
            Pause
          </button>
          <button
            className={styles.resetButton}
            onClick={resetTimer}
          >
            Reset
          </button>
        </div>
      ) : isPaused ? (
        <div className={styles.controlButtons}>
          <button
            className={styles.resumeButton}
            onClick={resumeTimer}
          >
            Resume
          </button>
          <button
            className={styles.resetButton}
            onClick={resetTimer}
          >
            Reset
          </button>
        </div>
      ) : (
        <button
          className={styles.startButton}
          onClick={startTimer}
          disabled={!isEditable}
        >
          Start
        </button>
      )}
         {/* {
           (isComplete)
           &&  <PopUpAnimate />
         } */}
      <PomodoroBar  
          hours={timerState.hours}
          minutes={timerState.minutes}
          seconds={timerState.seconds}
          isRunning={timerState.isRunning}
          isEditable={isEditable}
      />
</div>
);
};

export default Timer;