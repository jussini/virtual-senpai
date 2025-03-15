import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { PracticeTechnique, PracticeTechniqueList } from '../types/techniques'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import { Progress } from './Progress'
import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'
import Pause from '@mui/icons-material/Pause'
import PlayArrow from '@mui/icons-material/PlayArrow'
import Stop from '@mui/icons-material/Stop'
import yle_aikamerkki_beep from '../assets/yle_aikamerkki_beep.mp3'
import empty from '../assets/voice/empty.wav'
import { useVoice } from '../hooks/use-voice'
import Typography from '@mui/material/Typography'

type PlayState = 'Playing' | 'Paused'

const useSchedule = (list: PracticeTechniqueList, shuffle: boolean) => {
  const shuffled = useMemo(() => {
    return list
      .map((tech) => ({ tech, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ tech }) => tech)
  }, [list])

  const [scheduled, setScheduled] = useState<PracticeTechniqueList>(
    shuffle ? shuffled : list
  )

  useEffect(() => {
    setScheduled(shuffle ? shuffled : list)
  }, [list, shuffle, shuffled])

  const scheduleNext = useCallback(() => {
    const [, ...rest] = scheduled
    setScheduled(rest)
  }, [scheduled])

  const reset = () => {
    setScheduled(shuffle ? shuffled : list)
  }

  const [head, ...rest] = scheduled

  return {
    reset,
    head,
    rest,
    scheduleNext,
  } as const
}

type Props = {
  list: PracticeTechniqueList
  delay: number
  shuffle: boolean
  onStop: () => void
}

export const Player: React.FC<Props> = ({ list, delay, shuffle, onStop }) => {
  const [playState, setPlayState] = useState<PlayState>('Playing')
  const [waitingNext, setWaitingNext] = useState(false)

  const {
    head: scheduledText,
    rest: restScheduledTexts,
    scheduleNext,
  } = useSchedule(list, shuffle)

  const { play, playing } = useVoice()

  const speak = (text: PracticeTechnique | undefined) => {
    if (playing) {
      return
    }
    if (text !== undefined) {
      play(text).then(() => {
        setWaitingNext(true)
      })
    } else {
      // texts consumed
      onStop()
    }
  }

  // speak the first text
  useEffect(() => {
    // Soooo, for some reson chrome on mac plays the first sample a litle short.
    // It might or might not have something to do with the auto unlocking, I don't know.
    // Anyways, playing a short silent sample first, seems to mitigate this.
    new Howl({
      src: [empty],
      preload: true,
      autoplay: true,
      onend: () => speak(scheduledText),
    })

    // it really should be run only once, we don't need or want these scheduledText or speak as deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onPlayClicked = () => {
    if (playState === 'Paused') {
      setPlayState('Playing')
    }
  }

  const onPauseClicked = () => {
    if (playState !== 'Paused') {
      setPlayState('Paused')
    }
  }

  const onStopClicked = () => {
    onStop()
  }

  const onWaitEnd = () => {
    setWaitingNext(false)
    scheduleNext()
    const [peek] = restScheduledTexts
    if (playState === 'Playing') {
      speak(peek)
    }
  }

  return (
    <Box>
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div>
          <Box sx={{ mb: 4 }}>
            <Typography variant="overline">Nyt harjoitellaan</Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              {scheduledText}
            </Typography>
          </Box>
          <Box>
            <Typography variant="overline">Seuraavaksi</Typography>
            <Typography variant="body1">{restScheduledTexts[0]}</Typography>
          </Box>
        </div>
      </Box>
      <Paper
        sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}
        elevation={3}
      >
        {waitingNext && (
          <Progress
            duration={delay}
            onEnd={onWaitEnd}
            isActive={playState === 'Playing'}
            onEndWarning={() => {
              const sound = new Howl({
                src: [yle_aikamerkki_beep],
                preload: true,
              })
              sound.play()
            }}
          />
        )}
        <BottomNavigation showLabels>
          {playState === 'Playing' && (
            <BottomNavigationAction
              onClick={onPauseClicked}
              label="Pause"
              icon={<Pause />}
            />
          )}
          {playState === 'Paused' && (
            <BottomNavigationAction
              onClick={onPlayClicked}
              label="Play"
              icon={<PlayArrow />}
            />
          )}

          <BottomNavigationAction
            onClick={onStopClicked}
            label="Stop"
            icon={<Stop />}
          />
        </BottomNavigation>
      </Paper>
    </Box>
  )
}
