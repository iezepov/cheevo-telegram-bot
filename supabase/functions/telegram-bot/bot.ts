import {
  Bot,
  Context,
  NextFunction,
  // session,
  //   SessionFlavor,
} from "https://deno.land/x/grammy@v1.14.1/mod.ts";
// import { supabaseAdapter } from "https://deno.land/x/grammy_storages@v2.1.0/supabase/src/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1?target=es2022";
import { Database } from "./database.types.ts";

// ---- SESSION STUFF ----
// interface SessionData {
//   userState: string;
//   pizzaCount: number;
// }
// type MyContext = Context & SessionFlavor<SessionData>;
// const storage = supabaseAdapter({ supabase, table: "sessions" });
// const initial = () => {
//   return { userState: "initial", pizzaCount: 0 } as SessionData;
// };
// bot.use(
//   session({
//     initial,
//     storage,
//   }),
// );

type MyContext = Context;

const ADMIN_CHAT_ID = -814489354;
const VERSION = 10;

export const bot = new Bot<MyContext>(Deno.env.get("BOT_TOKEN") || "");
const supabase = createClient<Database>(
  Deno.env.get("SUPABASE_URL") || "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "",
);

const responseTime = async (_ctx: Context, next: NextFunction) => {
  const before = Date.now();
  await next();
  const after = Date.now();
  console.log(`Response time: ${after - before} ms`);
};

bot.use(responseTime);

const logUserMessages = async (ctx: Context, next: NextFunction) => {
  if (ctx.message && ctx.from) {
    console.debug("Logging user's message.");
    await supabase.from("messages").insert({
      user_id: ctx.from.id,
      // deno-lint-ignore no-explicit-any
      message: ctx.message as any,
    });
  }
  await next();
};

bot.use(logUserMessages);

bot.command("start", async (ctx) => {
  const user = ctx.from!;
  await supabase.from("users").insert({
    id: user.id,
    is_bot: user.is_bot,
    first_name: user.first_name,
    last_name: user.last_name,
    username: user.username,
    language_code: user.language_code,
  });

  await ctx.reply(`Started! Hello ${user.first_name}!`);
});

bot.command("ping", async (ctx) => {
  await ctx.reply(`pong! (version ${VERSION})`);
});

bot.on("message:voice", async (ctx) => {
  console.log("Got a voice message!");
  await Promise.all(
    [
      ctx.forwardMessage(ADMIN_CHAT_ID),
      bot.api.sendMessage(
        ADMIN_CHAT_ID,
        `🎙️ Got a new message from <a href="tg://user?id=${ctx.from.id}">${ctx.from.first_name}</a>!

Get back to them with the feedback within <tg-spoiler>24 hours</tg-spoiler>! `,
        { parse_mode: "HTML" },
      ),
      ctx.reply("Gotcha! Will get back to you soon."),
    ],
  );
});
