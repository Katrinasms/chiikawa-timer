export interface TimerState {
    hours: number;
    minutes: number;
    seconds: number;
    isRunning: boolean;
  }


export interface Character {
    type: 'cat-blue' | 'cat-white' | 'bunny';
    alt: string;
}

export interface TimerProps {
  initialHours?: number;
  initialMinutes?: number;
  initialSeconds?: number;
}