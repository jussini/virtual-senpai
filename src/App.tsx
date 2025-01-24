import React, { useCallback, useState } from 'react'

import CssBaseline from '@mui/material/CssBaseline'

import { InputForm } from './InputForm'
import { Player } from './Player'
import { PlayParams } from './types/play-params'

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
