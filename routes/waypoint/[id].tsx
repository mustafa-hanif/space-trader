import { Handlers } from "$fresh/server.ts";

import { getCookies } from "https://deno.land/std@0.211.0/http/cookie.ts";
import { Partial } from "$fresh/runtime.ts";
import Time from '../../islands/Time.tsx';
import { Waypoint } from '../../types/waypoint.ts';
import { ShipyardData } from '../../types/shipyard.ts';

export const handler: Handlers = {
  async POST(req, ctx) {
    const cookies = getCookies(req.headers);
    const token = cookies.token;
    const form = await req.formData();

    for (const entry of form.entries()) {
      console.log(entry);
    }
    
    const contractId = form.get("contractId")?.toString();

    if (contractId) {
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      };
  
      const data = await (await fetch(`https://api.spacetraders.io/v2/my/contracts/${contractId}/accept`, options)).json();
    }

    const shipType = form.get("shipType")?.toString();
    // console.log({ shipType });
    if (shipType) {
      const url = new URL(req.url);
      const shipyard = url.searchParams.get("shipyard");
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          shipType,
          waypointSymbol: shipyard,
        }),
      };
      const data = await (await fetch(`https://api.spacetraders.io/v2/my/ships`, options)).json();
      // console.log(data);
    }

    // Redirect user to thank you page.
    const headers = new Headers();
    headers.set("location", req.url);
    const res = new Response(null, {
      status: 303, // See Other
      headers,
    });
    return res;
  },
};

const get = async (req: Request, waypoint: string) => {
  const url = new URL(req.url);
  const traits = url.searchParams.get("traits");
  const shipyard = url.searchParams.get("shipyard");

  const cookies = getCookies(req.headers);

  const res = new Response(null, {
    status: 200, // See Other
  });
  const user = await cookies.token;
  // console.log({ user });

  const options = {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${user}`,
    },
  };

  let ships: ShipyardData;
  if (shipyard) {
    const sector = waypoint.split('-')[0];
    const system = `${sector}-${waypoint.split('-')[1]}`;
    const data =  await (await fetch(`https://api.spacetraders.io/v2/systems/${system}/waypoints/${shipyard}/shipyard`, options)).json();
    ships = data.data;
  }

  let traitWaypoints: Waypoint[] = [];
  if (traits) {
    const sector = waypoint.split('-')[0];
    const system = `${sector}-${waypoint.split('-')[1]}`;
    const data =  await (await fetch(`https://api.spacetraders.io/v2/systems/${system}/waypoints?traits=${traits}`, options))
    .json();
    // console.log(data);
    traitWaypoints = data.data;
  }

  const data =
    await (await fetch("https://api.spacetraders.io/v2/my/agent", options))
      .json();
  const contracts =
    await (await fetch("https://api.spacetraders.io/v2/my/contracts", options))
      .json();
  return {
    agent: data.data,
    ships,
    contracts: contracts.data,
    traitWaypoints
  };
};

interface Agent {
  symbol: string;
  headquarters: string;
  credits: string;
  startingFaction: string;
  shipCount: string;
}

interface Contract {
  id: string;
  factionSymbol: string;
  type: string;
  terms: {
    deadline: string;
    payment: {
      onAccepted: number;
      onFulfilled: number;
    };
    deliver: {
      tradeSymbol: string;
      destinationSymbol: string;
      unitsRequired: number;
      unitsFulfilled: number;
    }[];
  };
  accepted: boolean;
  fulfilled: boolean;
  expiration: string;
  deadlineToAccept: string;
}

const dateCnv = (isoDate) => {
  const date = new Date(isoDate);

  const formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
  });
  return formattedDate;
}
export default async function Waypoint(_req: Request, ctx) {
  console.log(ctx.params);
  const data: {
    agent: Agent;
    contracts: Contract[];
    traitWaypoints: Waypoint[];
    ships: ShipyardData;
  } = await get(_req, ctx.params.id);

  const { agent, contracts, traitWaypoints, ships } = data;
  return (
    <div class="flex gap-2 w-full">
    <div class="w-96">
      <div>Hello {agent.symbol}</div>
      <div>
        You are located at:
        <a
          href={`/waypoint/${agent.headquarters}`}
          f-partial={`/partials/waypoint/${agent.headquarters}`}
        >
          {agent.headquarters}
        </a>
      </div>
      <div>You have: {agent.credits} credits</div>
      <div>You are a member of: {agent.startingFaction}</div>
      <div>You have {agent.shipCount} ships</div>

      <div class="my-2">
        <Partial name="waypoint">
          <div>Click on a waypoint to load its info</div>
        </Partial>
      </div>

      <div class="my-2">
        <Partial name="contracts">
          <div>
            <div>Contracts</div>
            <div class="flex flex-col gap-2">
              {contracts.map((contract) => (
                <div class="flex flex-col gap-1 bg-slate-400">
                  <form method="post" name="contract">
                    <div>Contract ID: {contract.id}</div>
                    <input
                      type="hidden"
                      name="contractId"
                      value={contract.id}
                    />
                    <div>Faction: {contract.factionSymbol}</div>
                    <div>Type: {contract.type}</div>
                    <div>Accepted: {contract.accepted ? "Yes" : "No"}</div>
                    <div>Fulfilled: {contract.fulfilled ? "Yes" : "No"}</div>
                    <div>Deadline: {dateCnv(contract.deadlineToAccept)}</div>
                    <div>Expiration: {dateCnv(contract.expiration)}</div>
                    {contract.accepted ? <div>Time remaining to complete: <Time isoDate={contract.expiration} /></div> : null}
                    {!contract.accepted ? <div>Time remaining to accept: <Time isoDate={contract.deadlineToAccept} /></div> : null}
                    <div>
                      Payment on Accept: {contract.terms.payment.onAccepted}
                    </div>
                    <div>
                      Payment on Fulfillment:{" "}
                      {contract.terms.payment.onFulfilled}
                    </div>
                    <div class="mb-2">
                      Deliveries:
                      <div class="flex flex-col gap-1">
                        {contract.terms.deliver.map((delivery) => (
                          <div class="flex flex-col gap-1">
                            <div>Trade Symbol: {delivery.tradeSymbol}</div>
                            <div>Destination: {delivery.destinationSymbol}</div>
                            <div>Units Required: {delivery.unitsRequired}</div>
                            <div>
                              Units Fulfilled: {delivery.unitsFulfilled}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    {contract.accepted ? (
                      <div class="bg-green-600 text-white w-full">
                        Contract Accepted Ongoing
                      </div>
                    ) : (
                      <button type="submit" class="bg-blue-600 text-white w-full">
                        Accept Contract
                      </button>
                    )}
                  </form>
                </div>
              ))}
            </div>
          </div>
        </Partial>
      </div>


    </div>
      <div>
        <a href={`${_req.url}?traits=SHIPYARD`}>Find Shipyards</a>
        {traitWaypoints.length > 0 ? <div class="flex flex-col gap-2">
          {traitWaypoints.map((waypoint) => (
            <div class="flex flex-col gap-1 bg-slate-400">
              <div>Waypoint ID: {waypoint.symbol}</div>
              <div>Type: {waypoint.type}</div>
              <div><a href={getShipFindingUrl(_req.url, waypoint.symbol)}>Find Ships here</a></div>
            </div>
          ))}
        </div> : null}
      </div>
      <div>
        Available Ships:
        {ships ? <div class="flex flex-col gap-2">
          {ships.ships.map((ship) => (
            <div>
              <div>Type: {ship.type}</div>
              <div>Name: {ship.name}</div>
              <div>Price: {ship.purchasePrice}</div>
              <form method="post">
                <input type="hidden" name="shipType" value={ship.type} />
                <button type="submit">Buy Ship</button>
              </form>
            </div>
          ))}
        </div> : null}
      </div>
      <div>
        <a href="">Find Asteroids</a>
        
      </div>
    </div>
  );
}

const getShipFindingUrl = (url: string, waypoint: string) => {
  const urlObj = new URL(url);
  urlObj.searchParams.set("shipyard", waypoint);
  return urlObj.toString();
}