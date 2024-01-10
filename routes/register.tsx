import { Handlers } from "$fresh/server.ts";
import { CookieJar } from "https://deno.land/x/cookies/mod.ts";

export const handler: Handlers = {
  async GET(req, ctx) {
    return await ctx.render();
  },
  async POST(req, ctx) {
    const form = await req.formData();
    const callsign = form.get("callsign")?.toString();
    console.log({ callsign });
    
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        symbol: callsign,
        faction: "COSMIC",
      }),
    };

    const raw = await fetch('https://api.spacetraders.io/v2/register', options)
    const json = await raw.json();
    console.log(json);

    // Redirect user to thank you page.
    const headers = new Headers();
    headers.set("location", "/start-game");
    const res = new Response(null, {
      status: 303, // See Other
      headers,
    });

    const cookies = new CookieJar(req, res, {
      keys: ["secret", "keys"],
      secure: true,
    });

    cookies.set("token", json.data.token, { signed: true });

    return res;
  },
};

export default function Subscribe() {
  return (
    <>
      <form method="post">
        <div class="flex flex-col m-10 w-72 gap-8">
          <label>Call Sign</label>
          <input type="callsign" name="callsign" class="bg-slate-100" value="" />
          <button class="bg-slate-500" type="submit">Register</button>
        </div>
      </form>
    </>
  );
}