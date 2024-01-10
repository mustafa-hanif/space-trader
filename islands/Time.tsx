import { signal, effect } from "@preact/signals";

const differenceInMinutes = signal(0);

export default function Time({ isoDate }) {
  effect(() => {
    const intervalId = setInterval(() => {
      const date = new Date(isoDate);

      const now = new Date();

      const differenceInMilliseconds = date - now;
      differenceInMinutes.value = Math.floor(differenceInMilliseconds / 1000 / 60);
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  });
  
  return (
    <div>{differenceInMinutes} minutes remaining</div>
  );
}