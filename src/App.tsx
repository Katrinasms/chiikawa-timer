import './App.css'
import Timer from './components/Timer/Timer'
import Characters from './components/Characters/Characters'
import MessagesBox from './components/MessagesBox/MessagesBox'
import { CharacterProvider } from './services/CharacterContext';

function App() {

  return (
    <CharacterProvider>
      <p style={{textAlign:'center', color:'red', fontWeight:'bold'}}>STILL UNDER CONSTRUCTION</p>
      <MessagesBox />
      <Characters />
      <Timer /> 
    </CharacterProvider>
  )
}

export default App
