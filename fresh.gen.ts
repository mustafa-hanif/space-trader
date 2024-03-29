// DO NOT EDIT. This file is generated by Fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import * as $_404 from "./routes/_404.tsx";
import * as $_app from "./routes/_app.tsx";
import * as $api_joke from "./routes/api/joke.ts";
import * as $greet_name_ from "./routes/greet/[name].tsx";
import * as $index from "./routes/index.tsx";
import * as $partials_waypoint_id_ from "./routes/partials/waypoint/[id].tsx";
import * as $register from "./routes/register.tsx";
import * as $start_game from "./routes/start-game.tsx";
import * as $waypoint_id_ from "./routes/waypoint/[id].tsx";
import * as $Counter from "./islands/Counter.tsx";
import * as $Game from "./islands/Game.tsx";
import * as $SecondCountdown from "./islands/SecondCountdown.tsx";
import * as $Time from "./islands/Time.tsx";
import { type Manifest } from "$fresh/server.ts";

const manifest = {
  routes: {
    "./routes/_404.tsx": $_404,
    "./routes/_app.tsx": $_app,
    "./routes/api/joke.ts": $api_joke,
    "./routes/greet/[name].tsx": $greet_name_,
    "./routes/index.tsx": $index,
    "./routes/partials/waypoint/[id].tsx": $partials_waypoint_id_,
    "./routes/register.tsx": $register,
    "./routes/start-game.tsx": $start_game,
    "./routes/waypoint/[id].tsx": $waypoint_id_,
  },
  islands: {
    "./islands/Counter.tsx": $Counter,
    "./islands/Game.tsx": $Game,
    "./islands/SecondCountdown.tsx": $SecondCountdown,
    "./islands/Time.tsx": $Time,
  },
  baseUrl: import.meta.url,
} satisfies Manifest;

export default manifest;
