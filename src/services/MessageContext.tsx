import { createContext, useReducer, ReactNode, Dispatch } from 'react';

type Message = {
  text: string;
  position: string;
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
  message: { text: 'Please Select the time you want to focus?', position: 'top', color: 'white' },
  workMessages: [
    { text: "Let's work hard together!", position: 'top', color: '#7fb3d5' },
    { text: "Focus made us not regret", position: 'center', color: 'green' },
    { text: "Keep going, you're doing great!", position: 'bottom', color: 'green' },
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
          text: "Welcome to Chiikawa Time! This timer helps you boost your focus by counting 25 minutes for work/study/focus and then 5 minutes for rest. Hope we can work hard and love Chiikawa harder with this timer.",
          position: 'top',
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
        message: { text: "Yaha, let's rest!", position: 'bottom', color: 'red' },
      };
    case 'NEXT_WORK_MESSAGE':
      return {
        ...state,
        message: { ...state.workMessages[Math.floor(Math.random() * state.workMessages.length)] },
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
