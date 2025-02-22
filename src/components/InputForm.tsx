import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import FormLabel from '@mui/material/FormLabel'
import List from '@mui/material/List'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Switch from '@mui/material/Switch'
import React, { useCallback } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { PracticeTechniqueList } from '../types/techniques'
import {
  kyu1List,
  kyu1List2007,
  kyu2List,
  kyu2List2007,
  kyu3List,
  kyu3List2007,
  kyu4List,
  kyu4List2007,
  kyu5List,
  kyu5List2007,
  kyu6List,
  kyu6List2007,
} from '../constants/kyuLists'
import ListItem from '@mui/material/ListItem'
import { PlayParams } from '../types/play-params'
import Button from '@mui/material/Button'
import { useAtom } from 'jotai'
import { TextField } from '@mui/material'
import { Inputs, SetList } from '../types/input-form'
import { formState } from '../atoms/atoms'
import { setListNames } from '../constants/setLists'

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
    case 'kyu1List2007':
      return kyu1List2007
    case 'kyu2List2007':
        return kyu2List2007
    case 'kyu3List2007':
        return kyu3List2007
    case 'kyu4List2007':
      return kyu4List2007
    case 'kyu5List2007':
      return kyu5List2007
    case 'kyu6List2007':
      return kyu6List2007
    default: {
      throw new Error('Oops, missed kyu list target ' + listName)
    }
  }
}

type Props = {
  onStart: (params: PlayParams) => void
}

export const InputForm: React.FC<Props> = ({ onStart }) => {
  const [formDefaults, setFormDefaults] = useAtom(formState)

  const {
    control,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm<Inputs>({
    defaultValues: formDefaults,
  })

  const [setList] = watch(['setList'])

  const onSubmit: SubmitHandler<Inputs> = useCallback(
    (data) => {
      setFormDefaults(data)
      onStart({
        list: setListToKyuList(data.setList),
        delay: data.delay,
        shuffle: data.shuffle,
        listName: data.setList
      })
    },
    [onStart, setFormDefaults]
  )

  const setListMenuItems: Array<SetList> = [
    'kyu6List',
    'kyu6List2007',
    'kyu5List',
    'kyu5List2007',
    'kyu4List',
    'kyu4List2007',
    'kyu3List',
    'kyu3List2007',
    'kyu2List',
    'kyu2List2007',
    'kyu1List',
    'kyu1List2007'
  ] as const

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Box
        sx={{
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        <Controller
          control={control}
          name="setList"
          render={({ field: { value, onChange } }) => (
            <FormControl>
              <FormLabel>Tekniikkalista</FormLabel>
              <Select
                id="setList"
                onChange={(ev) => onChange(ev.target.value)}
                value={value}
              >
                { setListMenuItems.map((item) => (
                  <MenuItem key={item} value={item}>{setListNames[item]}</MenuItem>
                ))}
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
              <Switch onChange={(event) => onChange(event.target.checked)} />
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
          rules={{ min: 1, required: true }}
          render={({ field: { value, onChange } }) => (
            <TextField
              label="Kesto (sekuntia)"
              placeholder="Anna kestoaika sekunteina"
              helperText={
                errors.delay
                  ? 'Kesto on pakollinen tieto'
                  : 'Kuinka monta sekuntia yksittäistä tekniikkaa harjoitellaan.'
              }
              type="number"
              value={value}
              onChange={(e) => {
                onChange(e.target.value)
              }}
              slotProps={{
                inputLabel: { shrink: true },
                input: {},
              }}
              error={!!errors.delay}
            />
          )}
        ></Controller>
        <Box>
          <Button type="submit" variant="contained">
            Aloita
          </Button>
        </Box>
        <List
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat( auto-fit, minmax(300px, 1fr) )',
          }}
        >
          {setListToKyuList(setList).map((pt) => (
            <ListItem key={pt}>{pt}</ListItem>
          ))}
        </List>
      </Box>
    </form>
  )
}
