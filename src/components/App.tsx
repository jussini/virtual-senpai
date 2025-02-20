import React, { useCallback, useState } from 'react'

import CssBaseline from '@mui/material/CssBaseline'

import { InputForm } from './InputForm'
import { Player } from './Player'
import { PlayParams } from '../types/play-params'
import { AppBar, Toolbar, Typography } from '@mui/material'
import { setListNames } from '../constants/setLists'
import { WakeLock } from './WakeLock'

type AppState =
  | {
      playing: false
    }
  | {
      playing: true
      playParams: PlayParams
    }

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>({ playing: false })

  const onStart = useCallback((playParams: PlayParams) => {
    setAppState({
      playing: true,
      playParams,
    })
  }, [])

  const onStop = useCallback(() => {
    setAppState({ playing: false })
  }, [])

  return (
    <main>
      <CssBaseline />
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {appState.playing === false && 'Tekniikkavalinta'}
            {appState.playing && `Harjoitellaan: ${setListNames[appState.playParams.listName]}`}
          </Typography>
          <WakeLock enabled={appState.playing} />
        </Toolbar>
      </AppBar>
      {appState.playing === false && <InputForm onStart={onStart} />}
      {appState.playing && (
        <Player
          delay={appState.playParams.delay}
          list={appState.playParams.list}
          onStop={onStop}
          shuffle={appState.playParams.shuffle}
        />
      )}
    </main>
  )
}

export default App
