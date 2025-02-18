import { createContext, useReducer, ReactNode, Dispatch } from 'react';
// import { useTranslation } from 'react-i18next'

type Message = {
  text: string;
  class: string;
  color: string;
};

type MessageState = {
  message: Message;
  workMessages: Message[];
  chiikawaMessages: Message[];
  hachiwaMessages: Message[];
  usagiMessages: Message[];
};

type MessageAction = 
  | { type: 'BEFORE_TIMER_START' }
  | { type: 'WORK_STAGE' }
  | { type: 'REST_STAGE' }
  | { type: 'NEXT_WORK_MESSAGE' }
  | { type: 'CLICK_CHARACTER'; character: 'chiikawa' | 'hachiwa' | 'usagi' };


const initialState: MessageState = {
  message: { text: "welcome" , class: 'chiikawa', color: 'white' },
  workMessages: [
    { text: "work_hard", class: 'hachiwa', color: '#7fb3d5' },
    { text: "focus_no_regret", class: 'usagi', color: 'green' },
    { text: "keep_going", class: 'chiikawa', color: 'green' },
  ],
  chiikawaMessages: [
    { text: "star", class: 'chiikawa', color: 'blue' },
    { text: "shine", class: 'chiikawa', color: 'yellow' },
  ],
  hachiwaMessages: [
    { text: "amazing", class: 'hachiwa', color: 'purple' },
    { text: "awesome", class: 'hachiwa', color: 'pink' },
  ],
  usagiMessages: [
    { text: "fantastic", class: 'usagi', color: 'red' },
    { text: "rocking", class: 'usagi', color: 'orange' },
  ]
};

const MessageContext = createContext<{ state: MessageState; dispatch: Dispatch<MessageAction> }>({
  state: initialState,
  dispatch: () => null,
});

const messageReducer = (state: MessageState, action: MessageAction): MessageState => {
  switch (action.type) {
    case 'BEFORE_TIMER_START':
      return {
        ...state,
        message: {
          text: "welcome",
          class: 'chiikawa',
          color: '#7fb3d5',
        },
      };
    case 'WORK_STAGE':
      return {
        ...state,
        message: { ...state.workMessages[Math.floor(Math.random() * state.workMessages.length)] },
      };
    case 'REST_STAGE':
      return {
        ...state,
        message: { text: "Yaha, let's rest!", class: 'usagi', color: 'red' },
      };
    case 'NEXT_WORK_MESSAGE':
      return {
        ...state,
        message: { ...state.workMessages[Math.floor(Math.random() * state.workMessages.length)]},
      };
    case 'CLICK_CHARACTER':
      let characterMessages:Message[];
      switch (action.character) {
        case 'chiikawa':
          characterMessages = state.chiikawaMessages;
          break;
        case 'hachiwa':
          characterMessages = state.hachiwaMessages;
          break;
        case 'usagi':
          characterMessages = state.usagiMessages;
          break;
        default:
          characterMessages = [];
      }
      return {
        ...state,
        message: { ...characterMessages[Math.floor(Math.random() * characterMessages.length)]},
      };
    default:
      return state;
  }
};

const MessageProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(messageReducer, initialState);
  return (
    <MessageContext.Provider value={{ state, dispatch }}>
      {children}
    </MessageContext.Provider>
  );
};

export { MessageContext, MessageProvider };
