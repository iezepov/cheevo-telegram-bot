import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { webhookCallback } from "https://deno.land/x/grammy@v1.14.1/mod.ts";

import { bot } from "./bot.ts";

const handleUpdate = webhookCallback(bot, "std/http");

serve(async (req) => {
  if (req.method == "GET") {
    return new Response("ok");
  }

  try {
    const url = new URL(req.url);
    if (url.searchParams.get("secret") !== bot.token) {
      return new Response("Not allowed.", { status: 405 });
    }

    return await handleUpdate(req);
  } catch (err) {
    console.error(err);
  }
});
