import { signal, effect, computed } from "@preact/signals";

export default function Time({ isoDate, fast = false }) {
  const differenceInMinutes = signal(0);
  effect(() => {
    const intervalId = setInterval(() => {
      const date = new Date(isoDate);

      const now = new Date();

      const differenceInMilliseconds = date - now;
      if (differenceInMilliseconds > 0) {
        if (fast) {
          differenceInMinutes.value = (differenceInMilliseconds / 1000).toFixed(2);
        } else {
          differenceInMinutes.value = (differenceInMilliseconds / 1000 / 60).toFixed(2);
        }
        
      }
    }, fast ? 10 : 1000);

    return () => {
      clearInterval(intervalId);
    };
  });
  
  return (
    <div>{differenceInMinutes} {fast ? 'seconds' : 'minutes'} remaining</div>
  );
}