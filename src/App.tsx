import './App.css'
import Timer from './components/Timer/Timer'
import Characters from './components/Characters/Characters'
import MessagesBox from './components/MessagesBox/MessagesBox'
import { CharacterProvider } from './services/CharacterContext';
import { MessageProvider } from './services/MessageContext';
import LanguageSwitcher from './components/LanguageSwitcher/LanguageSwitcher';

function App() {

  return (
    <CharacterProvider>
      <MessageProvider>
      <LanguageSwitcher />
        <MessagesBox />
        <Characters />
        <Timer /> 
      </MessageProvider>
    </CharacterProvider>
  )
}

export default App
