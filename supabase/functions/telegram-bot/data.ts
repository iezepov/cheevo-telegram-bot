export enum BotActionType {
  SendMessage = 0,
}

export const enum StateNames {
  start = "start",
  level = "level",
  goal = "goal",

  steps = "steps",
  openQuestions = "open-questions",
  openQuestionsMeaning = "open-questions-meaning",

  openQuestions1 = "open-questions-1",
  openQuestions2 = "open-questions-2",

  effort = "effort",
  stepTwo = "step-two",
  stepThree = "step-three",
  stepFour = "step-four",
  stepFive = "step-five",

  trialLesson = "trial-lesson",
  blinkist1 = "blinkist-1",
  blinkist2 = "blinkist-2",

  done = "done",
}

export interface LocalizedString {
  ru: string;
  en: string;
}

interface MessageAction {
  type: BotActionType.SendMessage;
  text: LocalizedString;
}

export type BotAction = MessageAction;

interface Reply {
  text: LocalizedString;
  nextState: StateNames;
  botActions: BotAction[];
}

export interface State {
  replies: Reply[];
}

export interface BotData {
  states: { [K in StateNames]: State };
  messages: { [key: string]: LocalizedString };
}

const _levelMessages: BotAction[] = [
  {
    type: BotActionType.SendMessage,
    text: {
      en: "Thank you for sharing!",
      ru: "Поняла! Спасибо, что поделил(ся/ась).",
    },
  },
  {
    type: BotActionType.SendMessage,
    text: {
      en: "That will help me A LOT to find the right lessons for you!",
      ru: "Это очень поможет мне подобрать правильные уроки для тебя!",
    },
  },
  {
    type: BotActionType.SendMessage,
    text: {
      en: "Last question! What is your goal in English?",
      ru: "Последний вопрос! Что ты хочешь достичь в английском?",
    },
  },
];

const _goalMessages: BotAction[] = [
  {
    type: BotActionType.SendMessage,
    text: {
      en: "Got it! Thanks!",
      ru: "Понял! Спасибо, что поделился.",
    },
  },
  {
    type: BotActionType.SendMessage,
    text: {
      en: "Come along!",
      ru: "Поехали!",
    },
  },
  {
    type: BotActionType.SendMessage,
    text: {
      en: "I'll show you what we can do together in 5 simple steps!",
      ru: "Я покажу тебе, что мы можем сделать вместе за 5 простых шагов!",
    },
  },
];

const _openQuestionsMessages: BotAction[] = [
  {
    type: BotActionType.SendMessage,
    text: {
      en:
        "<b>Step One.</b> \nEvery time we meet I ask you <i>an open question</i>.",
      ru:
        "<b>Шаг 1.</b> \nКаждый раз, когда мы встречаемся, я задаю тебе <i>открытый вопрос</i>.",
    },
  },
  {
    type: BotActionType.SendMessage,
    text: {
      en:
        "Do you know why answering an open question is the fastest way to improve?",
      ru:
        "Знаешь, почему ответ на открытый вопрос - самый быстрый способ улучшить свой английский?",
    },
  },
];

const _openQuestionsMessagesWhy: BotAction[] = [
  {
    type: BotActionType.SendMessage,
    text: {
      en: "It makes you think a lot!",
      ru: "Это заставляет тебя много думать!",
    },
  },
  {
    type: BotActionType.SendMessage,
    text: {
      en: "It makes you USE the language",
      ru: "Это заставляет тебя ИСПОЛЬЗОВАТЬ язык",
    },
  },
  {
    type: BotActionType.SendMessage,
    text: {
      en: "We only remember what we truly understand and what we actually use",
      ru:
        "Мы запоминаем только то, что мы действительно понимаем и то, что мы действительно используем",
    },
  },
  {
    type: BotActionType.SendMessage,
    text: {
      en: "Does it make sense?",
      ru: "Понятно?",
    },
  },
];

export const OnboardingData: BotData = {
  messages: {
    "say_again": {
      en: "Sorry, I didn't get that. Could you please repeat?",
      ru: "Извини, я не понял. Можешь повторить?",
    },
    "language_confirmed": {
      en:
        "Great! I will speak to you in English. If you need to change it, just type /language.",
      ru:
        "Отлично! Я буду говорить на английском. Если захочешь поменять, просто отправь /language.",
    },
  },

  states: {
    "start": {
      replies: [
        {
          text: { en: "What's next?", ru: "Что дальше?" },
          nextState: StateNames.level,
          botActions: [
            {
              type: BotActionType.SendMessage,
              text: {
                en: "I am so happy you are here!",
                ru: "Я так рад, что ты со мной!",
              },
            },
            {
              type: BotActionType.SendMessage,
              text: {
                en: "I want to be your English buddy",
                ru: "Будем вместе оттачивать произношение!",
              },
            },
            {
              type: BotActionType.SendMessage,
              text: { en: "Can I ask you a question?", ru: "Вопросик есть." },
            },
            {
              type: BotActionType.SendMessage,
              text: {
                en: "What do you think your current level of English is?",
                ru: "Ты как свой уровень оцениваешь?",
              },
            },
          ],
        },
      ],
    },
    "level": {
      replies: [
        {
          text: { en: "I'm a beginner!", ru: "Я новичок!" },
          nextState: StateNames.goal,
          botActions: _levelMessages,
        },
        {
          text: {
            en: "I understand a lot but speaking is haaaard!",
            ru: "Я понимаю все, а сказать не могу 🐶",
          },
          nextState: StateNames.goal,
          botActions: _levelMessages,
        },
        {
          text: {
            en: "I'm pretty good at English but I want to be flawless 💎",
            ru: "Я ооочень хорош, что хочу чтобы вообще идеально 💎",
          },
          nextState: StateNames.goal,
          botActions: _levelMessages,
        },
      ],
    },
    "goal": {
      replies: [
        {
          text: {
            en: "For my work/to get a new job",
            ru: "Для новой и текущей работы",
          },
          nextState: StateNames.steps,
          botActions: _goalMessages,
        },
        {
          text: {
            en: "To study",
            ru: "Для учебы",
          },
          nextState: StateNames.steps,
          botActions: _goalMessages,
        },
        {
          text: {
            en: "To live in a new country/to travel with comfort ✈️",
            ru: "Для жизни в новой стране/для комфортного путешествия ✈️",
          },
          nextState: StateNames.steps,
          botActions: _goalMessages,
        },
        {
          text: {
            en: "I have my own reason",
            ru: "У меня своя причина",
          },
          nextState: StateNames.steps,
          botActions: _goalMessages,
        },
      ],
    },
    "steps": {
      replies: [
        {
          text: {
            en: "Okay!",
            ru: "Окей!",
          },
          nextState: StateNames.openQuestions,
          botActions: _openQuestionsMessages,
        },
        {
          text: {
            en: "Okay?",
            ru: "Окей?",
          },
          nextState: StateNames.openQuestions,
          botActions: _openQuestionsMessages,
        },
      ],
    },
    "open-questions": {
      replies: [
        {
          text: {
            en: "Why?",
            ru: "Почему?",
          },
          nextState: StateNames.openQuestions1,
          botActions: _openQuestionsMessagesWhy,
        },
        {
          text: {
            en: "Of course, it's clear to me!",
            ru: "Конечно, я понимаю!",
          },
          nextState: StateNames.openQuestions1,
          botActions: [
            {
              type: BotActionType.SendMessage,
              text: {
                en: "I knew we are on the same page!",
                ru: "Я знал, что мы на одной волне!",
              },
            },
            ..._openQuestionsMessagesWhy,
          ],
        },
        {
          text: {
            en: "What is an open question?",
            ru: "Что такое открытый вопрос?",
          },
          nextState: StateNames.openQuestionsMeaning,
          botActions: [
            {
              type: BotActionType.SendMessage,
              text: {
                en:
                  "An open question is a question that can't be answered with a simple yes or no. It requires a longer answer.",
                ru:
                  "Открытый вопрос - это вопрос, на который нельзя ответить просто да или нет. Он требует более длинного ответа.",
              },
            },
            {
              type: BotActionType.SendMessage,
              text: {
                en:
                  "For example, <i>What do you think about Harry Potter?</i> is an open question. <i>Do you like Harry Potter?</i> is not an open question.",
                ru:
                  "Например, <i>Что ты думаешь о Гарри Поттере?</i> - это открытый вопрос. <i>Тебе нравится Гарри Поттер?</i> - это не открытый вопрос.",
              },
            },
            {
              type: BotActionType.SendMessage,
              text: {
                en:
                  "Questions that starts with <i>Why, How, What, When, Where</i> are usually open questions.",
                ru:
                  "Вопросы, которые начинаются с <i>Почему, Как, Что, Когда, Где</i> обычно являются открытыми вопросами.",
              },
            },
            {
              type: BotActionType.SendMessage,
              text: {
                en: "I hope this helps!",
                ru: "Я надеюсь, это помогло!",
              },
            },
          ],
        },
      ],
    },
    "open-questions-meaning": {
      replies: [
        {
          text: {
            en: "Yes, thanks!",
            ru: "Да, спасибо!",
          },
          nextState: StateNames.openQuestions,
          botActions: [
            _openQuestionsMessages[1],
          ],
        },
      ],
    },
    "open-questions-1": {
      replies: [
        {
          text: {
            en: "Sure!",
            ru: "Конечно!",
          },
          nextState: StateNames.openQuestions2,
          botActions: [
            {
              type: BotActionType.SendMessage,
              text: {
                en:
                  "Also, answering open questions is a skill we need in real life.",
                ru:
                  "Также, ответы на открытые вопросы - это навык, который нам нужен в реальной жизни.",
              },
            },
            {
              type: BotActionType.SendMessage,
              text: {
                en: "People talk by asking and answering open questions",
                ru: "Люди общаются, задавая и отвечая на открытые вопросы",
              },
            },
          ],
        },
      ],
    },
    "open-questions-2": {
      replies: [
        {
          text: {
            en: "So true!",
            ru: "Так и есть!",
          },
          nextState: StateNames.effort,
          botActions: [
            {
              type: BotActionType.SendMessage,
              text: {
                en: "And I will train you to be awesome at this!",
                ru: "И я буду тренировать тебя быть отличным в этом!",
              },
            },
            {
              type: BotActionType.SendMessage,
              text: {
                en: "Everyone will be impressed by the way you talk!",
                ru: "Все будут восхищены тем, как ты говоришь!",
              },
            },
            {
              type: BotActionType.SendMessage,
              text: {
                en: "But you have to show up, okay?",
                ru: "Но ты должен показать себя (TODO), окей?",
              },
            },
          ],
        },
      ],
    },
    "effort": {
      replies: [
        {
          text: {
            en: "I know I have to do my part!",
            ru: "Я знаю, что я должен сделать свою часть!",
          },
          nextState: StateNames.stepTwo,
          botActions: [
            {
              type: BotActionType.SendMessage,
              text: {
                en: "Perfect!",
                ru: "Отлично!",
              },
            },
            {
              type: BotActionType.SendMessage,
              text: {
                en: "I know you will do your best to come here regularly",
                ru:
                  "Я знаю, что ты сделаешь все возможное, чтобы приходить сюда регулярно",
              },
            },
            {
              type: BotActionType.SendMessage,
              text: {
                en:
                  "I will do my best to keep it exciting for you by giving you the most amazing topics!",
                ru:
                  "Я сделаю все возможное, чтобы оставить это захватывающим для тебя, предоставляя тебе самые удивительные темы!",
              },
            },
            {
              type: BotActionType.SendMessage,
              text: {
                en:
                  "Social media, health issues, movies, news, scientific breakthroughs, awesome restaurants, celebrities, you name it!",
                ru:
                  "Социальные сети, проблемы здоровья, фильмы, новости, научные прорывы, удивительные рестораны, знаменитости, ты назовешь!",
              },
            },
          ],
        },
        {
          text: {
            en: "How often should I come to you to see results?",
            ru:
              "Как часто я должен приходить к тебе, чтобы увидеть результаты?",
          },
          nextState: StateNames.stepTwo,
          botActions: [
            {
              type: BotActionType.SendMessage,
              text: {
                en: "Ideally, every day!😃",
                ru: "Идеально, каждый день!😃",
              },
            },
            {
              type: BotActionType.SendMessage,
              text: {
                en: "But I know that it's hard",
                ru: "Но я знаю, что это трудно",
              },
            },
            {
              type: BotActionType.SendMessage,
              text: {
                en:
                  "If you come to train with me 2-3 times a week you will still see the results in 2-3 months",
                ru:
                  "Если ты придешь тренироваться со мной 2-3 раза в неделю, ты все равно увидишь результаты через 2-3 месяца",
              },
            },
            {
              type: BotActionType.SendMessage,
              text: {
                en: "Meanwhile...",
                ru: "Тем временем...",
              },
            },
            {
              type: BotActionType.SendMessage,
              text: {
                en:
                  "I will do my best to keep it exciting for you by giving you the most amazing topics!",
                ru:
                  "Я сделаю все возможное, чтобы оставить это захватывающим для тебя, предоставляя тебе самые удивительные темы!",
              },
            },
            {
              type: BotActionType.SendMessage,
              text: {
                en:
                  "Social media, health issues, movies, news, scientific breakthroughs, awesome restaurants, celebrities, you name it!",
                ru:
                  "Социальные сети, проблемы здоровья, фильмы, новости, научные прорывы, удивительные рестораны, знаменитости, ты назовешь!",
              },
            },
          ],
        },
      ],
    },
    "step-two": {
      replies: [
        {
          text: {
            en: "Awesome! What's next?",
            ru: "Отлично! Что дальше?",
          },
          nextState: StateNames.stepThree,
          botActions: [
            {
              type: BotActionType.SendMessage,
              text: {
                en: "<b>Step Two.</b>\nThe Language Tips",
                ru: "<b>Шаг два.</b>\nСоветы по языку",
              },
            },
            {
              type: BotActionType.SendMessage,
              text: {
                en: "Delivering a talk in English, even a short one...",
                ru: "Доставка доклада на английском, даже короткого...",
              },
            },
            {
              type: BotActionType.SendMessage,
              text: {
                en: "I know it can be scary",
                ru: "Я знаю, что это может быть страшно",
              },
            },
            {
              type: BotActionType.SendMessage,
              text: {
                en: "it can be hard",
                ru: "это может быть трудно",
              },
            },
            {
              type: BotActionType.SendMessage,
              text: {
                en: "But don’t worry! You are not alone!",
                ru: "Но не волнуйся! Ты не один!",
              },
            },
            {
              type: BotActionType.SendMessage,
              text: {
                en: "I’m here to help and I will send you everything you need.",
                ru:
                  "Я здесь, чтобы помочь, и я отправлю тебе все, что тебе нужно.",
              },
            },
            {
              type: BotActionType.SendMessage,
              text: {
                en:
                  "Awesome phrases to use, structures used by native speakers.",
                ru:
                  "Отличные фразы для использования, структуры, используемые родными говорящими.",
              },
            },
          ],
        },
      ],
    },
    "step-three": {
      replies: [
        {
          text: {
            en: "Are you going to show me some examples?!",
            ru: "Ты покажешь мне несколько примеров?!",
          },
          nextState: StateNames.stepFour,
          botActions: [
            {
              type: BotActionType.SendMessage,
              text: {
                en: "Of course!",
                ru: "Конечно!",
              },
            },
            {
              type: BotActionType.SendMessage,
              text: {
                en:
                  "<b>Step Three</b>\nI will send you an example of how native or proficient English speakers answer the same question.",
                ru:
                  "<b>Шаг три</b>\nЯ отправлю тебе пример того, как родные или профессиональные англоязычные говорящие отвечают на один и тот же вопрос.",
              },
            },
            {
              type: BotActionType.SendMessage,
              text: {
                en: "Ready for the fourth step?",
                ru: "Готов к четвертому шагу?",
              },
            },
          ],
        },
      ],
    },
    "step-four": {
      replies: [
        {
          text: {
            en: "Definitely!",
            ru: "Конечно!",
          },
          nextState: StateNames.stepFive,
          botActions: [
            {
              type: BotActionType.SendMessage,
              text: {
                en: "<b>Step Four</b>\nYour Time to Speak",
                ru: "<b>Шаг четыре</b>\nТвое время говорить",
              },
            },
            {
              type: BotActionType.SendMessage,
              text: {
                en: "This is your time to shine, my friend! ",
                ru: "Это твое время, чтобы сверкнуть, мой друг!",
              },
            },
            {
              type: BotActionType.SendMessage,
              text: {
                en:
                  "Use the tips! Use the example! Get ready to talk and answer the question in a one minute long voice message!",
                ru:
                  "Используй советы! Используй пример! Готовься говорить и отвечать на вопрос в голосовом сообщении длиной в одну минуту!",
              },
            },
            {
              type: BotActionType.SendMessage,
              text: {
                en: "Only one step left",
                ru: "Остался только один шаг",
              },
            },
            {
              type: BotActionType.SendMessage,
              text: {
                en: "But it's a very important one.",
                ru: "Но это очень важный.",
              },
            },
          ],
        },
      ],
    },
    "step-five": {
      replies: [
        {
          text: {
            en: "Tell me! I can't wait to start!",
            ru: "Расскажи! Я не могу дождаться начала!",
          },
          nextState: StateNames.trialLesson,
          botActions: [
            {
              type: BotActionType.SendMessage,
              text: {
                en: "okay...okay!",
                ru: "окей...окей!",
              },
            },
            {
              type: BotActionType.SendMessage,
              text: {
                en: "<b>Step Five</b>\nYour Feedback",
                ru: "<b>Шаг пять</b>\nТвой отзыв",
              },
            },
            {
              type: BotActionType.SendMessage,
              text: {
                en:
                  "I want you to get better and better with every short talk you record.",
                ru:
                  "Я хочу, чтобы ты становился лучше и лучше с каждым коротким разговором, который ты записываешь.",
              },
            },
            {
              type: BotActionType.SendMessage,
              text: {
                en:
                  "That’s why I forward your messages to a professional English teacher",
                ru:
                  "Вот почему я пересылаю твои сообщения профессиональному английскому учителю",
              },
            },
            {
              type: BotActionType.SendMessage,
              text: {
                en:
                  "They listen to them carefully and get back to you as soon as they can with tips and tricks to sound more natural and improve your pronunciation.",
                ru:
                  "Они внимательно их слушают и как можно скорее отвечают тебе с советами и приемами, чтобы звучать более естественно и улучшить произношение.",
              },
            },
            {
              type: BotActionType.SendMessage,
              text: {
                en: "That’s it!",
                ru: "Вот и все!",
              },
            },
          ],
        },
      ],
    },
    "trial-lesson": {
      replies: [
        {
          text: {
            en: "Wow! Can I try it?",
            ru: "Ух ты! Могу я попробовать?",
          },
          nextState: StateNames.blinkist1,
          botActions: [
            {
              type: BotActionType.SendMessage,
              text: {
                en: "Of course!",
                ru: "Конечно!",
              },
            },
            {
              type: BotActionType.SendMessage,
              text: {
                en: "I was waiting for you to ask!",
                ru: "Я ждал, когда ты спросишь!",
              },
            },
            {
              type: BotActionType.SendMessage,
              text: {
                en:
                  "Today I want to show you what a typical workout at our English Gym is.\n\nI invite you to talk about habits and getting better.\n\nI love the idea that I can change and improve. I can learn to ski, I can build a business, I can master a new language. Do you love this idea too? \n\nOne of the great and terrible things about improvement is that it doesn't have to happen overnight. You can take little steps every day and come really far!\n\nGetting 1% better every day... Let's explore this idea today!\n\nIs getting 1% better EVERY DAY enough to achieve your goals?\n\nCheevo will help you get ready to answer this question in English like a pro! Follow her advice and good luck with delivering your first talk!",
                ru:
                  "Сегодня я хочу показать тебе, как выглядит типичная тренировка в нашем английском зале.\n\nЯ приглашаю тебя говорить о привычках и улучшении.\n\nМне нравится идея, что я могу меняться и улучшаться. Я могу научиться кататься на лыжах, я могу создать бизнес, я могу освоить новый язык. Тебе нравится эта идея?\n\nОдна из великих и ужасных вещей в улучшении - это то, что оно не должно происходить ночью. Ты можешь делать маленькие шаги каждый день и прийти далеко!\n\nПолучать 1% лучше каждый день... Давайте исследуем эту идею сегодня!\n\nДостаточно ли получать 1% лучше КАЖДЫЙ ДЕНЬ, чтобы достичь своих целей?\n\nCheevo поможет тебе готовиться к ответу на этот вопрос на английском, как профессионал! Следуй ее советам и удачи с твоим первым разговором!",
              },
            },
            {
              type: BotActionType.SendMessage,
              text: {
                en: "I wonder what you have to say!",
                ru: "Я удивлен, что ты должен сказать!",
              },
            },
            {
              type: BotActionType.SendMessage,
              text: {
                en:
                  "Your topic for today is: <tg-spoiler>Is getting 1% better EVERY DAY enough to achieve your goals?</tg-spoiler>",
                ru:
                  "Твой топик на сегодня: <tg-spoiler>Достаточно ли получать 1% лучше КАЖДЫЙ ДЕНЬ, чтобы достичь своих целей?</tg-spoiler>",
              },
            },
            {
              type: BotActionType.SendMessage,
              text: {
                en: "Let's get you prepared to answer!",
                ru: "Давай подготовим тебя к ответу!",
              },
            },
            {
              type: BotActionType.SendMessage,
              text: {
                en: "Listen to this audio file first and answer the questions",
                ru: "Сначала прослушай этот аудиофайл и ответь на вопросы",
              },
            },
            {
              type: BotActionType.SendMessage,
              text: {
                en: "VOICE MESSAGE",
                ru: "VOICE MESSAGE",
              },
            },
          ],
        },
      ],
    },
    "blinkist-1": {
      replies: [],
    },
    "blinkist-2": {
      replies: [],
    },
    "done": {
      replies: [
        {
          text: {
            en: "Okay!",
            ru: "Окей!",
          },
          nextState: StateNames.done,
          botActions: [
            {
              type: BotActionType.SendMessage,
              text: {
                en: "You are done! 🎉 You can always /start over.",
                ru: "Ты закончил! 🎉 Ты всегда можешь начать заново. (/start)",
              },
            },
          ],
        },
      ],
    },
  },
};
