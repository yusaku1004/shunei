import { useState, useEffect } from 'react'
import { seedIfEmpty } from './db/index'
import HomeScreen from './components/HomeScreen'
import DeckSession from './components/DeckSession'
import SRSSession from './components/SRSSession'
import SettingsScreen from './components/SettingsScreen'

export default function App() {
  const [screen, setScreen] = useState('home')

  useEffect(() => {
    seedIfEmpty()
  }, [])

  if (screen === 'deck') return <DeckSession onHome={() => setScreen('home')} />
  if (screen === 'srs') return <SRSSession onHome={() => setScreen('home')} />
  if (screen === 'settings') return <SettingsScreen onBack={() => setScreen('home')} />

  return (
    <HomeScreen
      onStartDeck={() => setScreen('deck')}
      onStartSRS={() => setScreen('srs')}
      onOpenSettings={() => setScreen('settings')}
    />
  )
}
