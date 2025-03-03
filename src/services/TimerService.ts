// services/TimerService.ts
export class TimerService {
    private timerId: NodeJS.Timeout | null = null;
    private callback: ((hours:number, minutes: number, seconds: number) => void) | null = null;
    private onComplete: (() => void) | null = null;

    private totalDuration: number  | null = null; 
    private targetTime: number | null = null; // Target end time (timestamp in ms)

    
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
      // Set the target finishing time based on the current time
      this.totalDuration = this.hours * 3600 + this.minutes * 60 + this.seconds;
      this.targetTime = Date.now() + this.totalDuration * 1000;
      window.history.replaceState({}, '', `?target=${this.targetTime}`);
      const targetTimestamp = Math.floor(this.getTargetTimestampFromUrl()/1000);
      console.log('targetTimestamp',targetTimestamp);
      const currentTimestamp =  Math.floor(Date.now()/1000);;
      console.log('currentTimestamp',currentTimestamp);

      const differenceS = targetTimestamp - currentTimestamp;
      if(differenceS < 0) {
        this.reset(0,30,0);
      }else {
        const hours = Math.floor(differenceS / 3600); // 3600 seconds = 1 hour
        const minutes = Math.floor((differenceS % 3600) / 60); // Remaining minutes
        const seconds = differenceS % 60;
  
  
        this.hours = hours;
        this.minutes = minutes;
        this.seconds = seconds; 
        this.startCountdown();
      }

 
    }
  
    public pause(): void {
      if (this.timerId) {
        clearInterval(this.timerId);
        this.timerId = null;
      }
    }

    public resume(): void {
      if (!this.timerId) {
        this.totalDuration = this.hours * 3600 + this.minutes * 60 + this.seconds;
        this.targetTime = Date.now() + this.totalDuration * 1000;
        window.history.replaceState({}, '', `?target=${this.targetTime}`);
        this.startCountdown();
      }
      
    }
  
    public reset(hours:number, minutes: number, seconds: number): void {
      this.pause();
      this.hours = hours;
      this.minutes = minutes;
      this.seconds = seconds;
      const baseUrl = window.location.origin;
      window.history.replaceState({}, '', baseUrl);
      if (this.callback) {
        this.callback(this.hours, this.minutes, this.seconds);
      }
    }

    public getTargetTimestampFromUrl(): number {
      // Get the current URL
      const url = new URL(window.location.href);
    
      // Extract the `target` query parameter
      const targetParam = url.searchParams.get('target');
      console.log('target',targetParam);
    
      if (!targetParam) {
        throw new Error('Target timestamp is missing in the URL');
      }
    
      // Parse the timestamp as a number
      const targetTimestamp = parseInt(targetParam, 10);
    
      if (isNaN(targetTimestamp)) {
        throw new Error('Invalid target timestamp in the URL');
      }
    
      return targetTimestamp;
    }
  
    private startCountdown(): void {
      this.timerId = setInterval(() => {
  
        if (this.hours === 0 && this.minutes  === 0 && this.seconds === 0) {
          console.log('on0');
          this.pause();
          if (this.onComplete) {
            console.log('onComplete');
            const baseUrl = window.location.origin;
            window.history.replaceState({}, '', baseUrl);
            this.onComplete();
          }
          return;
        }

        const targetTimestamp = Math.floor(this.getTargetTimestampFromUrl()/1000);
        console.log('targetTimestamp',targetTimestamp);
        const currentTimestamp =  Math.floor(Date.now()/1000);;
        console.log('currentTimestamp',currentTimestamp);

        const differenceS = targetTimestamp - currentTimestamp;

        const hours = Math.floor(differenceS / 3600); 
        const minutes = Math.floor((differenceS % 3600) / 60);
        const seconds = differenceS % 60;


        this.hours = hours;
        this.minutes = minutes;
        this.seconds = seconds; 

  
        // if (this.seconds === 0) {
        //   this.seconds = 59;
        //   if (this.minutes === 0){
        //     this.hours--;
        //     this.minutes = 59;
        //   }
        //   else {
        //     this.minutes--;
        //   }
        // } else {
        //   this.seconds--;
        // }
  
        if (this.callback) {
          this.callback(this.hours,this.minutes, this.seconds);
        }
      }, 1000);
    }
  }

        // const targetTimestamp = Math.floor(this.getTargetTimestampFromUrl()/1000);
        // console.log('targetTimestamp',targetTimestamp);
        // const currentTimestamp =  Math.floor(Date.now()/1000);;
        // console.log('currentTimestamp',currentTimestamp);

        // const differenceS = targetTimestamp - currentTimestamp;

        // const hours = Math.floor(differenceS / 3600); // 3600 seconds = 1 hour
        // const minutes = Math.floor((differenceS % 3600) / 60); // Remaining minutes
        // const seconds = differenceS % 60;


        // this.hours = hours;
        // this.minutes = minutes;
        // this.seconds = seconds; 