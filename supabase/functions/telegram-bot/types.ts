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

type BotAction = MessageAction;

interface Reply {
  text: LocalizedString;
  nextState: string;
  botActions: BotAction[];
}

export interface State {
  replies: Reply[];
}

export interface BotData {
  states: { [key: string]: State };
}
