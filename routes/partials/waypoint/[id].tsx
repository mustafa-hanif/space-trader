import { RouteConfig } from "$fresh/server.ts";
import { Partial } from "$fresh/runtime.ts";
import { getCookies } from "https://deno.land/std@0.211.0/http/cookie.ts";
import { Waypoint } from '../../../types/waypoint.ts';

const getWaypoint = async (req: Request, waypoint: string) => {
  const cookies = getCookies(req.headers);

  const res = new Response(null, {
    status: 200, // See Other
  })
  const user = await cookies.token;
  // console.log({ user });

  const options = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user}`
    },
  };

  const sector = waypoint.split('-')[0];
  const system = `${sector}-${waypoint.split('-')[1]}`;
  
  const data = await(await fetch(`https://api.spacetraders.io/v2/systems/${system}/waypoints/${waypoint}`, 
  options)).json();
  return data.data;
}



export const config: RouteConfig = {
  skipAppWrapper: true,
  skipInheritedLayouts: true,
};

export default async function Waypoint(_req: Request, ctx) {
  const waypoint: Waypoint = await getWaypoint(_req, ctx.params.id);
  // Only render the new content
  return (
    <Partial name="waypoint">
      <div>
        <div>Type: {waypoint.type}</div>
        <div>System: {waypoint.systemSymbol}</div>
        <div>Orbitals: {waypoint.orbitals.map(o => o.symbol).join(', ')}</div>
      </div>
    </Partial>
  );
};