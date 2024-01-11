import { signal, effect } from "@preact/signals";



export default function SecondCountdown({ seconds }: { seconds: number }) {
  const _seconds = signal(0);
  _seconds.value = seconds;
  effect(() => {
    const intervalId = setInterval(() => {
      if (_seconds.value > 0) {
        _seconds.value -= 1;
      }
    }, 1000);
    return () => {
      clearInterval(intervalId);
    };
  });
  
  return (
    <span>{_seconds}</span>
  );
}