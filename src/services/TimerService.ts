// services/TimerService.ts
export class TimerService {
    private timerId: NodeJS.Timeout | null = null;
    private callback: ((hours:number, minutes: number, seconds: number) => void) | null = null;
    private onComplete: (() => void) | null = null;
  
    constructor(
      private hours: number,
      private minutes: number,
      private seconds: number
    ) {}
  
    public start(
      updateCallback: (hours:number, minutes: number, seconds: number) => void,
      completeCallback: () => void
    ): void {
      this.callback = updateCallback;
      this.onComplete = completeCallback;
      this.startCountdown();
    }
  
    public pause(): void {
      if (this.timerId) {
        clearInterval(this.timerId);
        this.timerId = null;
      }
    }

    public resume(): void {
      if (!this.timerId) {
        this.startCountdown();
      }
    }
  
    public reset(hours:number, minutes: number, seconds: number): void {
      this.pause();
      this.hours = hours;
      this.minutes = minutes;
      this.seconds = seconds;
      if (this.callback) {
        this.callback(this.hours, this.minutes, this.seconds);
      }
    }
  
    private startCountdown(): void {
      this.timerId = setInterval(() => {
        if (this.hours === 0 && this.minutes === 0 && this.seconds === 0) {
          this.pause();
          if (this.onComplete) {
            this.onComplete();
          }
          return;
        }
  
        if (this.seconds === 0) {
          this.seconds = 59;
          if (this.minutes === 0){
            this.hours--;
            this.minutes = 59;
          }
          else {
            this.minutes--;
          }
        } else {
          this.seconds--;
        }
  
        if (this.callback) {
          this.callback(this.hours,this.minutes, this.seconds);
        }
      }, 1000);
    }
  }