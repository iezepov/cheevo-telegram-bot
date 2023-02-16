import {
  Bot,
  Context,
  InlineKeyboard,
  Keyboard,
} from "https://deno.land/x/grammy@v1.14.1/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { Database } from "./database.types.ts";
import { BotActionType, LocalizedString, State } from "./types.ts";
import { OnboardingData } from "./data.ts";

interface UserProperties {
  language: keyof LocalizedString;
  state: string;
}

type MyContext = Context & { user: UserProperties | undefined };

export const bot = new Bot<MyContext>(Deno.env.get("BOT_TOKEN") || "");

const supabase = createClient<Database>(
  Deno.env.get("SUPABASE_URL") || "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "",
);

const ADMIN_CHAT_ID = -814489354;

const VERSION = 109;
bot.command("version", async (ctx) => await ctx.reply(`version ${VERSION}`));

// Read user's info from the database and store it in the context.
bot.use(async (ctx, next) => {
  if (ctx.from) {
    console.debug("Supabase read call");
    const { data } = await supabase.from("users").select("language, state")
      .eq(
        "id",
        ctx.from.id,
      );
    if (data && data[0]) {
      const [res] = data;
      ctx.user = { language: res.language as "en" | "ru", state: res.state };
    }
  }
  await next();
});

// Log every user's message to the database.
bot.use(async (ctx, next) => {
  if (ctx.message && ctx.from) {
    console.debug("Logging user's message.");
    await supabase.from("messages").insert({
      user_id: ctx.from.id,
      // deno-lint-ignore no-explicit-any
      message: ctx.message as any,
    });
  }
  await next();
});

const LANGAUGE_SELECT_REPLIES: LocalizedString = {
  "en": "🇬🇧 I am okay with English.",
  "ru": "🇷🇺 Ой, давай по-русски!",
};

bot.command("start", async (ctx) => {
  console.debug("Executing start");
  await ctx.reply(`Hello ${ctx.from!.first_name}! 👋`);

  await ctx.reply("First of all. What language would you like to speak?", {
    reply_markup: new Keyboard()
      .text(LANGAUGE_SELECT_REPLIES["en"]).row()
      .text(LANGAUGE_SELECT_REPLIES["ru"])
      .resized().oneTime(),
  });
});

/*
-----------------------------
----- Language setting. -----
-----------------------------
*/
bot.command("language", async (ctx) => {
  await ctx.reply("🤨", {
    reply_markup: new InlineKeyboard()
      .text("🇬🇧", "set-lang-en")
      .text("🇷🇺", "set-lang-ru"),
  });
});

bot.callbackQuery("set-lang-ru", async (ctx) => {
  await supabase.from("users").update({ language: "ru" }).eq("id", ctx.from.id);
  await ctx.answerCallbackQuery({
    text: "Готово! Теперь я говорю по-русски!",
  });
});

bot.callbackQuery("set-lang-en", async (ctx) => {
  await supabase.from("users").update({ language: "en" }).eq("id", ctx.from.id);
  await ctx.answerCallbackQuery({
    text: "Done! I will speak English from now on.",
  });
});

/*
-------------------------------
----- Initial user setup. -----
-------------------------------
*/
bot.on("message:text").hears(LANGAUGE_SELECT_REPLIES["en"], async (ctx) => {
  console.debug("Executing lang handler - en");
  const user = ctx.from!;
  await Promise.all([
    supabase.from("users").upsert({
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      username: user.username,
      language: "en",
      state: "start",
    }),
    ctx.reply(`English it is!`, {
      reply_markup: new Keyboard().text("What's next?").resized().oneTime(),
    }),
  ]);
});

bot.on("message:text").hears(LANGAUGE_SELECT_REPLIES["ru"], async (ctx) => {
  console.debug("Executing lang handler - ru");
  const user = ctx.from!;
  await Promise.all([
    supabase.from("users").upsert({
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      username: user.username,
      language: "ru",
      state: "start",
    }),
    ctx.reply(`Без проблем!`, {
      reply_markup: new Keyboard().text("Что дальше?").resized().oneTime(),
    }),
  ]);
});

/*
----------------------------------
----- Main messages handler. -----
----------------------------------
*/

const makeReplyKeyboard = (state: State, language: keyof LocalizedString) => {
  let keyboard = new Keyboard();
  state.replies.forEach((reply) => {
    keyboard = keyboard.add(reply.text[language]).row();
  });
  return keyboard.oneTime().resized();
};

bot.on("message:text", async (ctx) => {
  console.debug("Executing message handler");
  if (!ctx.user) {
    await ctx.reply("/start");
    return;
  }

  const language = ctx.user.language;
  const state = OnboardingData.states[ctx.user.state];

  const recivedReply = state.replies.find((reply) =>
    reply.text[language] == ctx.message.text
  );

  if (recivedReply) {
    for (let i = 0; i < recivedReply.botActions.length - 1; i++) {
      const action = recivedReply.botActions[i];
      if (action.type == BotActionType.SendMessage) {
        await ctx.reply(action.text[language]);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    // We send the keyboard with the last one.
    const action = recivedReply.botActions[recivedReply.botActions.length - 1];
    if (action.type == BotActionType.SendMessage) {
      const nextState = OnboardingData.states[recivedReply.nextState];
      await Promise.all([
        ctx.reply(action.text[language], {
          reply_markup: makeReplyKeyboard(nextState, language),
        }),
        supabase.from("users").update({ state: recivedReply.nextState }).eq(
          "id",
          ctx.from.id,
        ),
      ]);
    }
  } else {
    await ctx.reply("Sorry I didn't get that! Еще раз скажи?", {
      reply_markup: makeReplyKeyboard(state, language),
    });
  }
});

/*
------------------------------------
----- Voice message forwarder. -----
------------------------------------
*/
bot.on("message:voice", async (ctx) => {
  console.debug("Got a voice message!");
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
