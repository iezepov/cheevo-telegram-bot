import { BotActionType, BotData } from "./types.ts";

export const OnboardingData: BotData = {
  states: {
    "start": {
      replies: [
        {
          text: { en: "What's next?", ru: "Что дальше?" },
          nextState: "onboarding-level",
          botActions: [
            {
              type: BotActionType.SendMessage,
              text: { en: "I am so happy you are here!", ru: "Я - Чиво!" },
            },
            {
              type: BotActionType.SendMessage,
              text: { en: "I want to be your English buddy", ru: "Я - Чиво!" },
            },
            {
              type: BotActionType.SendMessage,
              text: { en: "Can I ask you a question?", ru: "Я - Чиво!" },
            },
            {
              type: BotActionType.SendMessage,
              text: {
                en: "What do you think your current level of English is?",
                ru: "Я - Чиво!",
              },
            },
          ],
        },
      ],
    },
    "onboarding-level": {
      replies: [
        {
          text: { en: "I'm a beginner!", ru: "Я новичок!" },
          nextState: "onboarding-done",
          botActions: [
            {
              type: BotActionType.SendMessage,
              text: {
                en: "Thank you for sharing!",
                ru: "Понял! Спасибо, что поделился.",
              },
            },
          ],
        },
        {
          text: {
            en: "I understand a lot but speaking is haaaard!",
            ru: "Я понимаю все, а сказать не могу 🐶",
          },
          nextState: "onboarding-done",
          botActions: [
            {
              type: BotActionType.SendMessage,
              text: {
                en: "Thank you for sharing!",
                ru: "Понял! Спасибо, что поделился.",
              },
            },
          ],
        },
        {
          text: {
            en: "I'm pretty good at English but I want to be flawless 💎",
            ru: "Я ооочень хорош, что хочу чтобы вообще идеально 💎",
          },
          nextState: "onboarding-done",
          botActions: [
            {
              type: BotActionType.SendMessage,
              text: {
                en: "Thank you for sharing!",
                ru: "Понял! Спасибо, что поделился.",
              },
            },
          ],
        },
      ],
    },
    "onboarding-done": {
      replies: [
        {
          text: {
            en: "I think I'm stuck in a loop. Is it so?",
            ru: "Мне кажется я в цикле. Это так?",
          },
          nextState: "onboarding-done",
          botActions: [
            {
              type: BotActionType.SendMessage,
              text: {
                en: "What do you think?",
                ru: "А ты как думаешь?",
              },
            },
          ],
        },
      ],
    },
  },
};
