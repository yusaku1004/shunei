import { useState, useEffect } from 'react'
import { seedIfEmpty } from './db/index'
import HomeScreen from './components/HomeScreen'
import DeckSession from './components/DeckSession'
import SRSSession from './components/SRSSession'
import SettingsScreen from './components/SettingsScreen'
import SentenceManager from './components/SentenceManager'
import StatsScreen from './components/StatsScreen'
import { setStudyLevels } from './studyPrefs'

export default function App() {
  const [screen, setScreen] = useState('home')

  useEffect(() => {
    seedIfEmpty()
  }, [])

  if (screen === 'deck') return <DeckSession onHome={() => setScreen('home')} />
  if (screen === 'srs') return <SRSSession onHome={() => setScreen('home')} />
  if (screen === 'settings') {
    return (
      <SettingsScreen
        onBack={() => setScreen('home')}
        onManage={() => setScreen('manage')}
      />
    )
  }
  if (screen === 'manage') return <SentenceManager onBack={() => setScreen('settings')} />
  if (screen === 'stats') {
    return (
      <StatsScreen
        onBack={() => setScreen('home')}
        onStudyLevel={(lv) => { setStudyLevels([lv]); setScreen('deck') }}
      />
    )
  }

  return (
    <HomeScreen
      onStartDeck={() => setScreen('deck')}
      onStartSRS={() => setScreen('srs')}
      onOpenSettings={() => setScreen('settings')}
      onOpenStats={() => setScreen('stats')}
    />
  )
}
