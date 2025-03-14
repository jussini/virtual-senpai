import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import FormLabel from '@mui/material/FormLabel'
import List from '@mui/material/List'
import MenuItem from '@mui/material/MenuItem'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import Switch from '@mui/material/Switch'
import React, { useState } from 'react'
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
  const [setList, setSetList] = useState<SetList>(formDefaults.setList)

  const handleSetListChange = (event: SelectChangeEvent<SetList>) => {
    setSetList(event.target.value as SetList)
  }

  const onFormAction = (formData: FormData) => {
    const values: Inputs = {
      delay: Number(formData.get('delay')),
      setList: formData.get('setList') as SetList,
      shuffle: formData.get('shuffle') === 'on',
    }

    setFormDefaults(values)
    onStart({
      list: setListToKyuList(values.setList),
      delay: values.delay,
      shuffle: values.shuffle,
      listName: values.setList,
    })
  }

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
    'kyu1List2007',
  ] as const

  return (
    <form action={onFormAction}>
      <Box
        sx={{
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        <FormControl>
          <FormLabel>Tekniikkalista</FormLabel>
          <Select
            name="setList"
            id="setList"
            defaultValue={formDefaults.setList}
            onChange={handleSetListChange}
          >
            {setListMenuItems.map((item) => (
              <MenuItem key={item} value={item}>
                {setListNames[item]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel>Sekoita</FormLabel>
          <Switch name="shuffle" defaultChecked={formDefaults.shuffle} />
          <FormHelperText>Käydäänkö lista läpi sekoitettuna?</FormHelperText>
        </FormControl>

        <FormControl>
          <FormLabel>Kesto (sekuntia)</FormLabel>
          <TextField
            name="delay"
            placeholder="Anna kestoaika sekunteina"
            defaultValue={formDefaults.delay}
            type="number"
          />
          <FormHelperText>
            Kuinka monta sekuntia yksittäistä tekniikkaa harjoitellaan.
          </FormHelperText>
        </FormControl>
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
