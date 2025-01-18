import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import {
  kyu1List,
  kyu2List,
  kyu3List,
  kyu4List,
  kyu5List,
  kyu6List,
} from './constants/kyuLists'
import { PracticeTechnique, PracticeTechniqueList } from './types/techniques'
import { useVoice } from './lib/voices'
import Paper from '@mui/material/Paper'
import CssBaseline from '@mui/material/CssBaseline'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import FormHelperText from '@mui/material/FormHelperText'
import Switch from '@mui/material/Switch'
import Input from '@mui/material/Input'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import { Progress } from './Progress'
import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'
import { Pause, PlayArrow, Stop } from '@mui/icons-material'
import yle_aikamerkki_beep from './assets/yle_aikamerkki_beep.mp3'

type SetList =
  | 'kyu6List'
  | 'kyu5List'
  | 'kyu4List'
  | 'kyu3List'
  | 'kyu2List'
  | 'kyu1List'

type Inputs = {
  setList: SetList
  shuffle: boolean
  delay: number
}

type PlayState = 'Stopped' | 'Playing' | 'Paused'

const setListToKyuList = (listName: SetList): PracticeTechniqueList => {
  switch (listName) {
    case 'kyu6List':
      return kyu6List
    case 'kyu5List':
      return kyu5List
    case 'kyu4List':
      return kyu4List
    case 'kyu3List':
      return kyu3List
    case 'kyu2List':
      return kyu2List
    case 'kyu1List':
      return kyu1List
    default:
      throw new Error('Oops, missed kyu list target ' + listName)
  }
}

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

const App: React.FC = () => {
  const { watch, control } = useForm<Inputs>({
    defaultValues: {
      setList: 'kyu6List',
      delay: 30,
    },
  })

  const [setList, shuffle, delay] = watch(['setList', 'shuffle', 'delay'])
  const [playState, setPlayState] = useState<PlayState>('Stopped')
  const [waitingNext, setWaitingNext] = useState(false)

  const {
    reset,
    head: scheduledText,
    rest: restScheduledTexts,
    scheduleNext,
  } = useSchedule(setListToKyuList(setList), shuffle)

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
      setPlayState('Stopped')
      reset()
      return
    }
  }

  const onPlayClicked = () => {
    if (playState === 'Paused') {
      setPlayState('Playing')
    }
    if (playState === 'Stopped') {
      setPlayState('Playing')
      speak(scheduledText)
    }
  }

  const onPauseClicked = () => {
    if (playState !== 'Paused') {
      setPlayState('Paused')
    }
  }

  const onStopClicked = () => {
    if (playState !== 'Stopped') {
      setPlayState('Stopped')
      reset()
    }
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
    <main>
      <CssBaseline />
      <form>
        <Paper
          sx={{
            mx: 3,
            mt: 3,
            mb: 4,
            py: 3,
            px: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            borderRadius: 'sm',
            boxShadow: 'md',
          }}
        >
          <Controller
            control={control}
            name="setList"
            render={({ field: { value, onChange } }) => (
              <FormControl>
                <FormLabel>Harjoituslista</FormLabel>
                <Select
                  id="setList"
                  onChange={(ev) => onChange(ev.target.value)}
                  value={value}
                  disabled={playState !== 'Stopped'}
                >
                  <MenuItem value="kyu6List">6. kyu</MenuItem>
                  <MenuItem value="kyu5List">5. kyu</MenuItem>
                  <MenuItem value="kyu4List">4. kyu</MenuItem>
                  <MenuItem value="kyu3List">3. kyu</MenuItem>
                  <MenuItem value="kyu2List">2. kyu</MenuItem>
                  <MenuItem value="kyu1List">1. kyu</MenuItem>
                </Select>
              </FormControl>
            )}
          ></Controller>

          <Controller
            control={control}
            name="shuffle"
            render={({ field: { value, onChange } }) => (
              <FormControl>
                <FormLabel>Sekoita</FormLabel>
                <Switch
                  onChange={(event) => onChange(event.target.checked)}
                  disabled={playState !== 'Stopped'}
                />
                <FormHelperText>
                  {value
                    ? 'Lista käydään läpi sekoitettuna.'
                    : 'Lista käydään läpi järjestyksessä.'}
                </FormHelperText>
              </FormControl>
            )}
          ></Controller>

          <Controller
            control={control}
            name="delay"
            render={({ field: { value, onChange } }) => (
              <FormControl>
                <FormLabel>Kesto (sekuntia)</FormLabel>
                {/*
                <CustomNumberInput
                  value={value}
                  onChange={(e) => {
                    if ("value" in e.target) {
                      onChange(Number(e.target.value));
                    }
                  }}
                  onInputChange={(e) => {
                    onChange(Number(e.target.value));
                  }}
                />                  
                  */}

                <Input
                  value={value}
                  onChange={(e) => {
                    onChange(e.target.value)
                  }}
                  disabled={playState !== 'Stopped'}
                />

                <FormHelperText>
                  Kuinka monta sekuntia yksittäistä tekniikkaa tehdään.
                </FormHelperText>
              </FormControl>
            )}
          ></Controller>
          <div>
            <List>
              {setListToKyuList(setList).map((pt) => (
                <ListItem
                  key={pt}
                  style={{
                    fontWeight:
                      playState !== 'Stopped' && pt === scheduledText
                        ? 'bold'
                        : undefined,
                  }}
                >
                  {pt}
                </ListItem>
              ))}
            </List>
          </div>
        </Paper>
        <Paper
          sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}
          elevation={3}
        >
          {(playState === 'Playing' || playState == 'Paused') &&
            waitingNext && (
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
            {(playState === 'Paused' || playState === 'Stopped') && (
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
      </form>
    </main>
  )
}

export default App
