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
};

type MessageAction = 
  | { type: 'BEFORE_TIMER_START' }
  | { type: 'WORK_STAGE' }
  | { type: 'REST_STAGE' }
  | { type: 'NEXT_WORK_MESSAGE' };

const initialState: MessageState = {
  message: { text: "welcome" , class: 'chiikawa', color: 'white' },
  workMessages: [
    { text: "work_hard", class: 'hachiwa', color: '#7fb3d5' },
    { text: "focus_no_regret", class: 'usagi', color: 'green' },
    { text: "keep_going", class: 'chiikawa', color: 'green' },
  ],
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
        message: { ...state.workMessages[Math.floor(Math.random() * state.workMessages.length)]
         },
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
