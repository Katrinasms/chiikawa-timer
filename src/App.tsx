import './App.css'
import Timer from './components/Timer/Timer'
import Characters from './components/Characters/Characters'
import MessagesBox from './components/MessagesBox/MessagesBox'
import { CharacterProvider } from './services/CharacterContext';
import { MessageProvider } from './services/MessageContext';

function App() {

  return (
    <CharacterProvider>
      <MessageProvider>
        <p style={{textAlign:'center', color:'red', fontWeight:'bold'}}>STILL UNDER CONSTRUCTION</p>
        <MessagesBox />
        <Characters />
        <Timer /> 
      </MessageProvider>
    </CharacterProvider>
  )
}

export default App
