import { useSignal } from "@preact/signals";
import Counter from "../islands/Counter.tsx";

export default function Home() {
  const count = useSignal(3);
  return (
    <div class="px-4 py-8 h-screen mx-auto bg-white">
      <div class="max-w-screen-md mx-auto flex flex-col items-center justify-center">
        <img
          class="my-6"
          src="/logo.svg"
          width="128"
          height="128"
          alt="the Fresh logo: a sliced lemon dripping with juice"
        />
        <h1 class="text-4xl font-bold">Welcome to Space Trader</h1>
        
      </div>
      <a href="/register" class="text-2xl mx-auto text-center block bg-slate-500 w-72 m-2 p-2 rounded-lg text-white font-bold">
        Register
      </a>
    </div>
  );
}
