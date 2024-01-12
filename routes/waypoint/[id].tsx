import { Handlers } from "$fresh/server.ts";

import { getCookies, setCookie } from "https://deno.land/std@0.211.0/http/cookie.ts";
import Time from "../../islands/Time.tsx";
import { Waypoint } from "../../types/waypoint.ts";
import { ShipyardData } from "../../types/shipyard.ts";
import { Ship } from "../../types/ship.ts";
import SecondCountdown from "../../islands/SecondCountdown.tsx";
import { Agent, Contract } from "../../types/agent.ts";
import { Market } from "../../types/market.ts";
import Game from '../../islands/Game.tsx';
import { CookieJar } from "https://deno.land/x/cookies@1.0.0/mod.ts";

export const handler: Handlers = {
  async POST(req, ctx) {
    const url = new URL(req.url);
    const cookies = getCookies(req.headers);
    const token = cookies.token;

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: "",
    };

    const form = await req.formData();

    for (const entry of form.entries()) {
      console.log(entry);
    }

    const units = form.get("units")?.toString();
    const item = form.get("item")?.toString();

    const contractId = form.get("contractId")?.toString();

    if (contractId) {
      const data =
        await (await fetch(
          `https://api.spacetraders.io/v2/my/contracts/${contractId}/accept`,
          options,
        )).json();
    }

    const shipType = form.get("shipType")?.toString();
  
    if (shipType) {
      const url = new URL(req.url);
      const shipyard = url.searchParams.get("shipyard");
      options.body = JSON.stringify({
        shipType,
        waypointSymbol: shipyard,
      });
      const data =
        await (await fetch(`https://api.spacetraders.io/v2/my/ships`, options))
          .json();
    }

    const myShipName = form.get("myShipName")?.toString();
    if (myShipName) {
      const action = form.get("action")?.toString();
      if (action === "navigate") {
        const destination = form.get("destination")?.toString();
        options.body = JSON.stringify({
          waypointSymbol: destination,
        });
        const data =
          await (await fetch(
            `https://api.spacetraders.io/v2/my/ships/${myShipName}/${action}`,
            options,
          )).json();
        if (data?.error?.message) {
          url.searchParams.set("error", data.error.message);
        }
      }

      if (action && ["dock", "orbit", "refuel", "extract"].includes(action)) {
        try {
          const data =
            await (await fetch(
              `https://api.spacetraders.io/v2/my/ships/${myShipName}/${action}`,
              options,
            )).json();
          
          if (data?.error?.message) {
            url.searchParams.set("error", data.error.message);
          } else {
            console.log(data);
            if (action === "extract") {
              const message = `Found ${data?.data.extraction.yield.units} of ${data?.data.extraction.yield.symbol}!`
              url.searchParams.set("success", message);
            }
          }
        } catch (e) {
          url.searchParams.set("error", e.message);
        }
      }

      if (units && item) {
        options.body = JSON.stringify({
          symbol: item,
          units
        });
        const data = await (await fetch(`https://api.spacetraders.io/v2/my/ships/${myShipName}/sell`, options)).json();
        if (data?.error?.message) {
          url.searchParams.set("error", data.error.message);
        }
      }
    }

    // Redirect user to thank you page.
    const headers = new Headers();
    headers.set("location", url.toString());
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
  const type = url.searchParams.get("type");
  const market = url.searchParams.get("market");

  const cookies = getCookies(req.headers);

  const res = new Response(null, {
    status: 200, // See Other
  });

  let user = cookies.token;
  if (user) {
    const kv = await Deno.openKv();
    const prefs = {
      user,
    };
    const result = await kv.set(["token"], prefs);
  } else {
    const kv = await Deno.openKv();
    const prefs = await kv.get(["token"]);
    if (prefs) {
      user = prefs.value.user;
      const cookies = new CookieJar(req, res, {
        keys: ["secret", "keys"],
        secure: true,
      });
  
      cookies.set("token", prefs.value.user, { signed: true });
  
    }
  }

  const options = {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${user}`,
    },
  };

  let ships: ShipyardData;
  if (shipyard) {
    const sector = waypoint.split("-")[0];
    const system = `${sector}-${waypoint.split("-")[1]}`;
    const data =
      await (await fetch(
        `https://api.spacetraders.io/v2/systems/${system}/waypoints/${shipyard}/shipyard`,
        options,
      )).json();
    ships = data.data;
  }

  let traitWaypoints: Waypoint[] = [];
  if (traits) {
    const sector = waypoint.split("-")[0];
    const system = `${sector}-${waypoint.split("-")[1]}`;
    const data =
      await (await fetch(
        `https://api.spacetraders.io/v2/systems/${system}/waypoints?traits=${traits}`,
        options,
      ))
        .json();
    traitWaypoints = data.data;
  }

  let typeSearch: Waypoint[] = [];
  if (type) {
    const sector = waypoint.split("-")[0];
    const system = `${sector}-${waypoint.split("-")[1]}`;
    const data =
      await (await fetch(
        `https://api.spacetraders.io/v2/systems/${system}/waypoints?type=${type}`,
        options,
      )).json();
    typeSearch = data.data;
  }

  let marketData: Market; 
  if (market) {
    const sector = waypoint.split("-")[0];
    const system = `${sector}-${waypoint.split("-")[1]}`;
    const data =
      await (await fetch(
        `https://api.spacetraders.io/v2/systems/${system}/waypoints/${market}/market`,
        options,
      )).json();
    marketData = data.data;
  }

  const data =
    await (await fetch("https://api.spacetraders.io/v2/my/agent", options))
      .json();

  const contracts =
    await (await fetch("https://api.spacetraders.io/v2/my/contracts", options))
      .json();

  const myShips =
    await (await fetch(`https://api.spacetraders.io/v2/my/ships`, options))
      .json();

  return {
    agent: data.data,
    ships,
    marketData,
    myShips: myShips.data,
    typeSearch,
    contracts: contracts.data,
    traitWaypoints,
  };
};

const dateCnv = (isoDate) => {
  const date = new Date(isoDate);

  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  return formattedDate;
};
export default async function Waypoint(_req: Request, ctx) {
  const data: {
    agent: Agent;
    contracts: Contract[];
    myShips: Ship[];
    marketData: Market;
    traitWaypoints: Waypoint[];
    typeSearch: Waypoint[];
    ships: ShipyardData;
  } = await get(_req, ctx.params.id);

  const url = new URL(_req.url);
  const error = url.searchParams.get("error");
  const success = url.searchParams.get("success");
  const urlWithOutError = url.toString().replace(/&error=.*/g, "");
  const urlWithOutMessage = url.toString().replace(/&success=.*/g, "");
  
  const { agent, contracts, traitWaypoints, ships, myShips, marketData, typeSearch } = data;
  const navigableWaypoints = typeSearch.map((waypoint) => waypoint.symbol);
  contracts?.forEach((contract) => {
    contract.terms.deliver.forEach((delivery) => {
      navigableWaypoints.push(delivery.destinationSymbol);
    });
  });

  return (
    <div class="flex gap-2 w-full">
      <div class="w-96">
        <div>Hello {agent.symbol}</div>
        <div>
          You are located at:
          <a href={`/waypoint/${agent.headquarters}`}>
            {agent.headquarters}
          </a>
        </div>
        <div>You have: {agent.credits} credits</div>
        <div>You are a member of: {agent.startingFaction}</div>
        <div>You have {agent.shipCount} ships</div>
        <div>
          {myShips.length > 0
            ? (
              <div class="flex flex-col gap-2">
                {myShips.map((ship) => (
                  <div class="flex flex-col gap-1 bg-slate-400">
                    <div>Ship ID: {ship.symbol}</div>
                    <div>Ship Type: {ship.registration.role}</div>
                    <div>Ship Status: {ship.nav.status}</div>
                    <div>Currently at: {ship.nav.waypointSymbol}</div>
                    <div>Fuel: {ship.fuel.current}/{ship.fuel.capacity}</div>
                    
                      <div>Cargo: {ship.cargo.inventory.map(item => {
                        return <div class="flex justify-between border-b-2">
                            <div>{item.units} of {item.name}</div>
                            {ship.nav.status === "DOCKED" ? 
                              <form method="post">
                                <input
                                  type="hidden"
                                  name="myShipName"
                                  value={ship.symbol}
                                />
                                <div>Units to sell: <input className="w-12" type="number" name="units" /> 
                                  <input type="hidden" name="item" value={item.symbol} />
                                  <button type="submit" class="bg-orange-700">Sell</button>
                                </div>
                              </form> : null}

                            {ship.nav.status === "IN_ORBIT" && contracts.map(c => c.terms.deliver.map(d => d.destinationSymbol)).flat().includes(ship.nav.waypointSymbol) ? 
                              <form method="post">
                                <input
                                  type="hidden"
                                  name="myShipName"
                                  value={ship.symbol}
                                />
                                <div>Units to deliver: <input className="w-12" type="number" name="units" /> 
                                  <input type="hidden" name="item" value={item.symbol} />
                                  <button type="submit" class="bg-orange-700">Deliver</button>
                                </div>
                              </form> : null}
                        </div>
                      })}</div>
                    
                    <div>
                      Cooldown:{" "}
                      <SecondCountdown
                        key={ship.symbol}
                        seconds={ship.cooldown.remainingSeconds}
                      />
                    </div>
                    {ship.nav.status === "IN_TRANSIT"
                      ? (
                        <div>
                          <div>Moving from: {ship.nav.route.origin.symbol}</div>
                          <div>
                            Going to: {ship.nav.route.destination.symbol}
                          </div>
                          <div>
                            Departure Time:{" "}
                            {dateCnv(ship.nav.route.departureTime)}
                          </div>
                          <div>
                            Arrival Time: {dateCnv(ship.nav.route.arrival)}
                          </div>
                          <div>
                            Going at speed: {ship.nav.flightMode}
                          </div>
                          <div>Arrives in <Time isoDate={ship.nav.route.arrival} /></div>
                        </div>
                      )
                      : null}
                    {ship.nav.status === "DOCKED"
                      ? (
                        <div class="flex flex-col gap-2">
                          <form method="post">
                            <input
                              type="hidden"
                              name="myShipName"
                              value={ship.symbol}
                            />
                            <input type="hidden" name="action" value="orbit" />
                            <button class="bg-blue-600 text-white w-full block">
                              Put in orbit
                            </button>
                          </form>
                          <form method="post">
                            <input
                              type="hidden"
                              name="myShipName"
                              value={ship.symbol}
                            />
                            <input type="hidden" name="action" value="refuel" />
                            <button class="bg-green-600 text-white w-full block">
                              Refuel
                            </button>
                          </form>
                        </div>
                      )
                      : null}

                    {ship.nav.status === "IN_ORBIT"
                      ? (
                        <div class="border-b-2">
                          <form method="post" class="flex w-full border-b-2">
                            <input
                              type="hidden"
                              name="myShipName"
                              value={ship.symbol}
                            />
                            <input
                              type="hidden"
                              name="action"
                              value="navigate"
                            />

                            <button class="bg-blue-600 text-white w-full block">
                              Navigate to
                            </button>
                            <select name="destination">
                              {navigableWaypoints.map((symbol) => (
                                <option value={symbol}>
                                  {symbol}
                                </option>
                              ))}
                            </select>
                          </form>
                          <form method="post" class="flex w-full">
                            <input
                              type="hidden"
                              name="myShipName"
                              value={ship.symbol}
                            />
                            <input type="hidden" name="action" value="dock" />
                            <button class="bg-green-600 text-white w-full block">
                              Dock Here
                            </button>
                          </form>
                          <form method="post" class="flex w-full">
                            <input
                              type="hidden"
                              name="myShipName"
                              value={ship.symbol}
                            />
                            <input
                              type="hidden"
                              name="action"
                              value="extract"
                            />
                            <button class="bg-teal-600 text-white w-full block">
                              Extract Minerals
                            </button>
                          </form>
                        </div>
                      )
                      : null}
                  </div>
                ))}
              </div>
            )
            : null}
        </div>
        <div class="my-2">
          <div>Click on a waypoint to load its info</div>
        </div>

        <div class="my-2">
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
                    {contract.accepted
                      ? (
                        <div>
                          Time remaining to complete:{" "}
                          <Time isoDate={contract.expiration} />
                        </div>
                      )
                      : null}
                    {!contract.accepted
                      ? (
                        <div>
                          Time remaining to accept:{" "}
                          <Time isoDate={contract.deadlineToAccept} />
                        </div>
                      )
                      : null}
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
                    {contract.accepted
                      ? (
                        <div class="bg-green-600 text-white w-full">
                          Contract Accepted Ongoing
                        </div>
                      )
                      : (
                        <button
                          type="submit"
                          class="bg-blue-600 text-white w-full"
                        >
                          Accept Contract
                        </button>
                      )}
                  </form>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div>
        <a href={`${_req.url}?traits=SHIPYARD`}>Find Shipyards</a>
        {traitWaypoints.length > 0
          ? (
            <div class="flex flex-col gap-2">
              {traitWaypoints.map((waypoint) => (
                <div class="flex flex-col gap-1 bg-slate-400">
                  <div>Waypoint ID: {waypoint.symbol}</div>
                  <div>Type: {waypoint.type}</div>
                  <div>
                    <a
                      class="bg-blue-600 text-white w-full block"
                      href={getShipFindingUrl(_req.url, waypoint.symbol)}
                    >
                      Find Ships here
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )
          : null}
          <Game ships={myShips} />
      </div>

      <div>
        Available Ships:
        {ships
          ? (
            <div class="flex flex-col gap-2">
              {ships.shipTypes?.map((ship, index) => (
                <div>
                  <div>Type: {ship.type}</div>
                  {ships?.ships
                    ? (
                      <>
                        <div>Name: {ships?.ships?.[index]?.name}</div>
                        <div>Price: {ships?.ships?.[index]?.purchasePrice}</div>
                      </>
                    )
                    : null}
                  <form method="post">
                    <input type="hidden" name="shipType" value={ship.type} />
                    <button type="submit" class="bg-blue-600 text-white w-full">
                      Buy Ship
                    </button>
                  </form>
                </div>
              ))}
            </div>
          )
          : null}
      </div>

      <div>
        <a href={getSearchTypeUrl(_req.url, "ENGINEERED_ASTEROID")}>
          Find Asteroids
        </a>
        {typeSearch.length > 0
          ? (
            <div class="flex flex-col gap-2">
              {typeSearch.map((waypoint) => (
                <div class="flex flex-col gap-1 bg-slate-400">
                  <div>Waypoint ID: {waypoint.symbol}</div>
                  <div>Type: {waypoint.type}</div>
                  <div><a class="bg-blue-600 text-white block w-full" href={getMarketUrl(_req.url, waypoint.symbol)}>Get Market Data</a></div>
                </div>
              ))}
            </div>
          )
          : null}
      </div>
      <div class="fixed w-96 bg-red-200 right-2 top-2">
        {error
          ? (
            <div class="w-full bg-red-200">
              <dialog class="bg-red-200" open>
                <p class="bg-red-200">{error}</p>
                <form method="dialog">
                  <a href={urlWithOutError} class="bg-red-800 p-2 text-white">OK</a>
                </form>
              </dialog>
            </div>
          )
          : null}
      </div>
      <div class="fixed w-96 bg-green-200 right-2 top-2">
        {success
          ? (
            <div class="w-full bg-green-200">
              <dialog class="bg-green-200" open>
                <p class="bg-green-200">{success}</p>
                <form method="dialog">
                  <a href={urlWithOutMessage} class="bg-green-800 p-2 text-white">OK</a>
                </form>
              </dialog>
            </div>
          )
          : null}
      </div>

      <div>
        <a href={getSearchTypeUrl(_req.url, "ENGINEERED_ASTEROID")}>
          Market Data
        </a>
        {marketData?.exchange?.length > 0 ? (
            <div class="flex flex-col gap-2">
              Exchange items:
              {marketData?.exchange.map((item) => (
                <div class="flex flex-col gap-1 bg-slate-400">
                  <div>Name: {item?.name}</div>
                  <div>
                    Trade Goods
                    <div>{marketData?.tradeGoods?.map(goods => {
                      return <div>
                          <div>Name: {goods.symbol}</div>
                          <div>Purchase Price: {goods.purchasePrice}</div>
                          <div>Sell Price: {goods.sellPrice}</div>
                        </div>
                    })}</div>
                  </div>
                </div>
              ))}
            </div>
          )
          : null}
      </div>
    </div>
  );
}

const getShipFindingUrl = (url: string, waypoint: string) => {
  const urlObj = new URL(url);
  urlObj.searchParams.set("shipyard", waypoint);
  return urlObj.toString();
};

const getMarketUrl = (url: string, waypoint: string) => {
  const urlObj = new URL(url);
  urlObj.searchParams.set("market", waypoint);
  return urlObj.toString();
};

const getSearchTypeUrl = (url: string, type: string) => {
  const urlObj = new URL(url);
  urlObj.searchParams.set("type", type);
  return urlObj.toString();
};
