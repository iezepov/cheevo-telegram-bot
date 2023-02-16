export enum BotActionType {
  SendMessage = 0,
}

export interface LocalizedString {
  "ru": string;
  "en": string;
}

interface MessageAction {
  type: BotActionType.SendMessage;
  text: LocalizedString;
}

export type BotAction = MessageAction;

export interface Reply {
  text: LocalizedString;
  nextState: string;
  botActions: BotAction[];
}

export interface State {
  replies: Reply[];
}

interface BotData {
  states: { [key: string]: State };
}

export const OnboardingData: BotData = {
  states: {
    "start": {
      replies: [
        {
          text: { en: "What's next?", ru: "Что дальше?" },
          nextState: "onboarding-1",
          botActions: [{
            type: BotActionType.SendMessage,
            text: { en: "I am Cheevo", ru: "Я - Чиво!" },
          }, {
            type: BotActionType.SendMessage,
            text: { en: "I am Cheevo", ru: "Я - Чиво!" },
          }, {
            type: BotActionType.SendMessage,
            text: { en: "I am Cheevo", ru: "Я - Чиво!" },
          }],
        },
      ],
    },
    "onboarding-1": {
      replies: [
        {
          text: { en: "I am onboarded!", ru: "Я на борту!" },
          nextState: "onboarding-1",
          botActions: [{
            type: BotActionType.SendMessage,
            text: { en: "Ready for your voice message!", ru: "Жду голосочек!" },
          }],
        },
      ],
    },
  },
};

// Nice to meet you, ____!
// I am so happy you are here!
// I want to be your English buddy
// Can I ask you a question?
// What do you think your current level of English is?
