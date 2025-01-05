export interface TimerState {
    minutes: number;
    seconds: number;
    isRunning: boolean;
  }


export interface Character {
    type: 'cat-blue' | 'cat-white' | 'bunny';
    alt: string;
}
  
export interface TimerSettings {
    minDuration: number; // in minutes
    maxDuration: number; // in minutes
    step: number; // in seconds
}