import React, { useState,useRef,useEffect } from 'react';
import styles from './Timer.module.scss';
import {TimerState} from '../../types/index';
import { TimerService } from '../../services/TimerService';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';


interface TimerProps {
  initialMinutes?: number;
  initialSeconds?: number;
}

const Timer: React.FC<TimerProps> = ({
  initialMinutes = 2,
  initialSeconds = 30
}) => {

const [timerState, setTimerState] = useState<TimerState>({
minutes: initialMinutes,
seconds: initialSeconds,
isRunning: false
});

const timerServiceRef = useRef<TimerService | null>(null);

const incrementTime = (): void => {
if (timerState.minutes === 12 && timerState.seconds === 0) return;

setTimerState(prev => ({
    ...prev,
    minutes: prev.seconds === 30 ? prev.minutes + 1 : prev.minutes,
    seconds: prev.seconds === 30 ? 0 : 30
}));
};

const decrementTime = (): void => {
if (timerState.minutes === 0 && timerState.seconds === 30) return;

setTimerState(prev => ({
    ...prev,
    minutes: prev.seconds === 0 ? prev.minutes - 1 : prev.minutes,
    seconds: prev.seconds === 0 ? 30 : 0
}));
};

const startTimer = (): void => {
    timerServiceRef.current = new TimerService(timerState.minutes, timerState.seconds);
        timerServiceRef.current.start(
        (minutes, seconds) => {
            setTimerState(prev => ({
            ...prev,
            minutes,
            seconds
            }));
        },
        () => {
            setTimerState(prev => ({
            ...prev,
            isRunning: false
            }));
            // Handle timer completion
        }
        );
        setTimerState(prev => ({
        ...prev,
        isRunning: true
        }));

};

useEffect(() => {
    return () => {
      if (timerServiceRef.current) {
        timerServiceRef.current.pause();
      }
    };
  }, []);

return (
<div className={styles.timerContainer}>
    <div className={styles.timerDisplay}>
        <div className={styles.centerBox}>
         
        {!timerState.isRunning && (
               <button 
               className={styles.arrowButton}
               onClick={incrementTime}
               disabled={timerState.isRunning}
               aria-label="Increase time"
               >
               <KeyboardArrowUpIcon className={styles.arrowFont} />
           </button>
            )}
        <div className={styles.time}>
            {String(timerState.minutes).padStart(2)}
        </div>    
        
        {!timerState.isRunning && (
               <button 
        
               className={styles.arrowButton}
               onClick={decrementTime}
               disabled={timerState.isRunning}
               >
                   <KeyboardArrowDownIcon className={styles.arrowFont} />
               </button>
        )}
        </div>
        <div className={styles.time}>
            :
        </div>
        <div className={styles.centerBox}>
        {!timerState.isRunning && (
               <button 
               className={styles.arrowButton}
               onClick={incrementTime}
               disabled={timerState.isRunning}
               aria-label="Increase time"
               >
               <KeyboardArrowUpIcon className={styles.arrowFont} />
           </button>
            )}
        <div className={styles.time}>
            {String(timerState.seconds).padStart(2, '0')}
        </div>    
        {!timerState.isRunning && (
               <button 
        
               className={styles.arrowButton}
               onClick={decrementTime}
               disabled={timerState.isRunning}
               >
                   <KeyboardArrowDownIcon className={styles.arrowFont} />
               </button>
        )}
        </div>
    </div>
    <button 
        className={styles.startButton}
        onClick={startTimer}
        disabled={timerState.isRunning}
    >
        Start
    </button>

</div>
);
};

export default Timer;