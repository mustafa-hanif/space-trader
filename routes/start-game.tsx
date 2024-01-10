import { Handlers } from "$fresh/server.ts";

import { getCookies } from "https://deno.land/std@0.211.0/http/cookie.ts";
import { PageProps } from "$fresh/src/server/types.ts";
import { Partial } from "$fresh/runtime.ts";

  const get = async (req: Request) => {
    const cookies = getCookies(req.headers);

    const res = new Response(null, {
      status: 200, // See Other
    })
    const user = cookies.token;
    // console.log({ user });

    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user}`
      },
    };

    const data = await(await fetch('https://api.spacetraders.io/v2/my/agent', options)).json();
    return data.data;
}

interface Data {
  symbol: string;
  headquarters: string;
  credits: string;
  startingFaction: string;
  shipCount: string;
}

export default async function Subscribe(_req: Request, ctx) {
  console.log(ctx.params);
  const data: Data = await get(_req);
  return (
    <div>
      <div>Hello {data.symbol}</div>
      <div>You are located at: 
        <a href={`/waypoint/${data.headquarters}`} f-partial={`/partials/waypoint/${data.headquarters}`}>{data.headquarters}</a>
      </div>
      <div>You have: {data.credits} credits</div>
      <div>You are a member of: {data.startingFaction}</div>
      <div>You have {data.shipCount} ships</div>
    </div>
  );
}