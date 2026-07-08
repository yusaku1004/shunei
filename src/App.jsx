import { useState, useEffect } from 'react'
import { seedIfEmpty } from './db/index'
import HomeScreen from './components/HomeScreen'
import ReadAloudSession from './components/ReadAloudSession'
import DeckSession from './components/DeckSession'
import SRSSession from './components/SRSSession'
import SettingsScreen from './components/SettingsScreen'
import SentenceManager from './components/SentenceManager'
import StatsScreen from './components/StatsScreen'
import MasteredScreen from './components/MasteredScreen'

export default function App() {
  const [screen, setScreen] = useState('home')

  useEffect(() => {
    seedIfEmpty()
  }, [])

  if (screen === 'readaloud') {
    return (
      <ReadAloudSession
        onHome={() => setScreen('home')}
        onStartDeck={() => setScreen('deck')}
      />
    )
  }
  if (screen === 'deck') return <DeckSession onHome={() => setScreen('home')} />
  if (screen === 'srs') {
    return (
      <SRSSession
        onHome={() => setScreen('home')}
        onStartDeck={() => setScreen('deck')}
      />
    )
  }
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
        onOpenMastered={() => setScreen('mastered')}
        onPractice={() => setScreen('deck')}
      />
    )
  }
  if (screen === 'mastered') return <MasteredScreen onBack={() => setScreen('stats')} />

  return (
    <HomeScreen
      onStartReadAloud={() => setScreen('readaloud')}
      onStartDeck={() => setScreen('deck')}
      onStartSRS={() => setScreen('srs')}
      onOpenSettings={() => setScreen('settings')}
      onOpenStats={() => setScreen('stats')}
    />
  )
}
