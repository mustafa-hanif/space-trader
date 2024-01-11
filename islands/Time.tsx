import { signal, effect } from "@preact/signals";
import { diff } from "$std/assert/_diff.ts";



export default function Time({ isoDate }) {
  const differenceInMinutes = signal(0);
  effect(() => {
    const intervalId = setInterval(() => {
      const date = new Date(isoDate);

      const now = new Date();

      const differenceInMilliseconds = date - now;
      if (differenceInMilliseconds > 0) {
        differenceInMinutes.value = Math.floor(differenceInMilliseconds / 1000 / 60);
      }
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  });
  
  return (
    <div>{differenceInMinutes} minutes remaining</div>
  );
}