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
  message: { text: "welcome" , class: 'all', color: 'white' },
  workMessages: [
    { text: "chiikawa_1", class: 'chiikawa', color: 'blue' },
    { text: "hachiwa_2", class: 'hachiwa', color: 'pink' },
    { text: "usagi_2", class: 'usagi', color: 'orange' },
  ],
  chiikawaMessages: [
    { text: "chiikawa_1", class: 'chiikawa', color: 'blue' },
    { text: "chiikawa_2", class: 'chiikawa', color: 'yellow' },
    { text: "chiikawa_3", class: 'chiikawa', color: 'blue' },
  ],
  hachiwaMessages: [
    { text: "hachiwa_1", class: 'hachiwa', color: 'purple' },
    { text: "hachiwa_2", class: 'hachiwa', color: 'pink' },
    { text: "hachiwa_3", class: 'hachiwa', color: 'pink' },
  ],
  usagiMessages: [
    { text: "usagi_1", class: 'usagi', color: 'red' },
    { text: "usagi_2", class: 'usagi', color: 'orange' },
    { text: "usagi_3", class: 'usagi', color: 'red' },
    { text: "usagi_4", class: 'usagi', color: 'orange' },
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
        message: { text: "usagi_1", class: 'usagi', color: 'red' },
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
