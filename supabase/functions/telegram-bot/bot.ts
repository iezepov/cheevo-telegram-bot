import {
  Bot,
  Context,
  InlineKeyboard,
  Keyboard,
} from "https://deno.land/x/grammy@v1.14.1/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { Database } from "./database.types.ts";
import {
  BotActionType,
  LocalizedString,
  OnboardingData,
  State,
  StateNames,
} from "./data.ts";

interface UserProperties {
  language: keyof LocalizedString;
  state: StateNames;
}

type MyContext = Context & { user: UserProperties | undefined };

const VERSION = 125;
const MESSAGES_DELAY = 2750;

export const bot = new Bot<MyContext>(Deno.env.get("BOT_TOKEN") || "");

const supabase = createClient<Database>(
  Deno.env.get("SUPABASE_URL") || "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "",
);

const ADMIN_CHAT_ID = -814489354;

// Read user's info from the database and store it in the context.
bot.use(async (ctx, next) => {
  if (ctx.from) {
    const { data } = await supabase.from("users").select("language, state")
      .eq(
        "id",
        ctx.from.id,
      );
    if (data && data[0]) {
      const [res] = data;
      ctx.user = { language: res.language, state: res.state as StateNames };
    }
  }
  await next();
});

// Log every user's message to the database.
bot.use(async (ctx, next) => {
  if (ctx.message && ctx.from) {
    await supabase.from("messages").insert({
      user_id: ctx.from.id,
      // deno-lint-ignore no-explicit-any
      message: ctx.message as any,
    });
  }
  await next();
});

bot.command(
  "info",
  async (ctx) => {
    const info = JSON.stringify(ctx.user, null, 2);
    await ctx.reply(
      `version: <b>${VERSION}</b>\nUser info:\n<pre>${info}</pre>`,
      { parse_mode: "HTML" },
    );
  },
);

// TODO: This doesn't quite work. Need to actually parse enum.
// bot.command(
//   "state",
//   async (ctx) => {
//     if (ctx.from && ctx.message) {
//       const newState = ctx.message.text.slice(7) as StateNames;
//       const res = await supabase
//         .from("users")
//         .update({ state: newState })
//         .eq("id", ctx.from.id);
//       await ctx.reply(res.statusText);
//     }
//   },
// );

const LANGAUGE_SELECT_REPLIES: LocalizedString = {
  "en": "🇬🇧 I am okay with English.",
  "ru": "🇷🇺 Ой, давай по-русски!",
};

bot.command("start", async (ctx) => {
  await ctx.reply(`Hello ${ctx.from!.first_name}! 👋`);

  await ctx.reply("First of all. What language would you like to speak?", {
    reply_markup: new Keyboard()
      .text(LANGAUGE_SELECT_REPLIES["en"]).row()
      .text(LANGAUGE_SELECT_REPLIES["ru"])
      .oneTime().resized(),
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
  await ctx.answerCallbackQuery("Готово!");
});

bot.callbackQuery("set-lang-en", async (ctx) => {
  await supabase.from("users").update({ language: "en" }).eq("id", ctx.from.id);
  await ctx.answerCallbackQuery("Done!");
});

/*
-------------------------------
----- Initial user setup. -----
-------------------------------
*/
bot.on("message:text").hears(LANGAUGE_SELECT_REPLIES["en"], async (ctx) => {
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
    ctx.reply(OnboardingData.messages["language_confirmed"].en, {
      reply_markup: new Keyboard()
        .text("What's next?")
        .oneTime().resized(),
    }),
  ]);
});

bot.on("message:text").hears(LANGAUGE_SELECT_REPLIES["ru"], async (ctx) => {
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
    ctx.reply(OnboardingData.messages["language_confirmed"].ru, {
      reply_markup: new Keyboard()
        .text("Что дальше?")
        .oneTime().resized(),
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
  state.replies.forEach((reply, index, array) => {
    keyboard = keyboard.text(reply.text[language]);
    if (index !== array.length - 1) keyboard = keyboard.row();
  });
  return keyboard.oneTime().resized();
};

bot.on("message:text", async (ctx) => {
  if (!ctx.user) {
    await ctx.reply("Click: /start");
    return;
  }

  const language = ctx.user.language;
  const state = OnboardingData.states[ctx.user.state];

  const recivedReply = state.replies.find((reply) =>
    reply.text[language] === ctx.message.text
  );

  if (recivedReply) {
    for (let i = 0; i < recivedReply.botActions.length - 1; i++) {
      const action = recivedReply.botActions[i];
      if (action.type === BotActionType.SendMessage) {
        await ctx.reply(action.text[language], { parse_mode: "HTML" });
        await ctx.replyWithChatAction("typing");
        await new Promise((resolve) =>
          setTimeout(resolve, ctx.from.id === 81743974 ? 250 : MESSAGES_DELAY)
        );
      }
    }

    // We send the keyboard with the last one.
    const action = recivedReply.botActions[recivedReply.botActions.length - 1];
    if (action.type === BotActionType.SendMessage) {
      const nextState = OnboardingData.states[recivedReply.nextState];
      await Promise.all([
        ctx.reply(action.text[language], {
          parse_mode: "HTML",
          reply_markup: makeReplyKeyboard(nextState, language),
        }),
        supabase.from("users").update({ state: recivedReply.nextState }).eq(
          "id",
          ctx.from.id,
        ),
      ]);
    }
  } else {
    await ctx.reply(OnboardingData.messages["say_again"][language], {
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
        `🎙️ Got a new message from <a href="tg://user?id=${ctx.from.id}">${ctx.from.first_name}</a>!\n\nGet back to them with the feedback within <tg-spoiler>24 hours</tg-spoiler>! `,
        { parse_mode: "HTML" },
      ),
      ctx.reply("Gotcha! Will get back to you soon."),
    ],
  );
});
