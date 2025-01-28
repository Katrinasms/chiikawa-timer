import React, { useState,useRef,useEffect } from 'react';
import styles from './Timer.module.scss';
import {TimerState} from '../../types/index';
import { TimerService } from '../../services/TimerService';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Clock from '../Clock/Clock';

interface TimerProps {
  initialHours?: number;
  initialMinutes?: number;
  initialSeconds?: number;
}

const Timer: React.FC<TimerProps> = ({
  initialHours = 2,
  initialMinutes = 30,
  initialSeconds = 0
}) => {

const [timerState, setTimerState] = useState<TimerState>({
    hours: initialHours,
    minutes: initialMinutes,
    seconds: initialSeconds,
    isRunning: false
});

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
        minutes: prev.minutes === 45? 0 : prev.minutes + 15,
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
        minutes: prev.minutes === 0? 45 : prev.minutes - 15,
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
<div className={`${styles.timerContainer} ${timerState.isRunning ? styles.shrunk : ''}`}>
    <div className={styles.timerDisplay}>
        <div className={styles.centerBox}>
               <button 
               className={`${styles.arrowButton} ${timerState.isRunning ? styles.hidden : ''}`}
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
        
               className={`${styles.arrowButton} ${timerState.isRunning ? styles.hidden : ''}`}
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
               className={`${styles.arrowButton} ${timerState.isRunning ? styles.hidden : ''}`}
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
               className={`${styles.arrowButton} ${timerState.isRunning ? styles.hidden : ''}`}
               onClick={decrementMinuteTime}
               disabled={timerState.isRunning}
               >
                   <KeyboardArrowDownIcon className={styles.arrowFont} />
               </button>
        </div>
    </div>
        <Clock seconds={timerState.seconds}/>
        <h1>Timer: {timerState.hours}:{timerState.minutes}:{timerState.seconds}</h1>
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