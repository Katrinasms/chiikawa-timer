import React, { createContext, useReducer, ReactNode, Dispatch } from 'react';

type Character = {
    name: string;
    imgSrc: string;
    color: string;
}

type State = {
    selectedCharacter: Character;
};

type Action = 
  | { type: 'SELECT_CHARACTER', payload: Character };

const initialState: State = {
  selectedCharacter: {
    name: 'yahausagi',
    imgSrc: '/assets/YahaUsagi.webp',
    color: '#FFF1CB',
  },
};

const CharacterContext = createContext<{ state: State; dispatch: Dispatch<Action> }>({
  state: initialState,
  dispatch: () => null,
});

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SELECT_CHARACTER':
      return { ...state, selectedCharacter: action.payload };
    default:
      return state;
  }
};

const CharacterProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <CharacterContext.Provider value={{ state, dispatch }}>
      {children}
    </CharacterContext.Provider>
  );
};

export { CharacterContext, CharacterProvider };
