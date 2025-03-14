import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import FormLabel from '@mui/material/FormLabel'
import MenuItem from '@mui/material/MenuItem'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import Switch from '@mui/material/Switch'
import React, { useState } from 'react'
import { PracticeTechnique, PracticeTechniqueList } from '../types/techniques'
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
import { PlayParams } from '../types/play-params'
import Button from '@mui/material/Button'
import { useAtom } from 'jotai'
import { Checkbox, FormControlLabel, FormGroup, TextField } from '@mui/material'
import { InputsSchema, SetList } from '../types/input-form'
import { formState } from '../atoms/atoms'
import { setListNames } from '../constants/setLists'
import { z } from 'zod'

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

const allTechsSet = setListMenuItems
  .map(setListToKyuList)
  .reduce((acc: Set<PracticeTechnique>, cur) => {
    cur.forEach((x) => acc.add(x))
    return acc
  }, new Set<PracticeTechnique>())

const practiceTechniqueListFrom = (names: string[]): PracticeTechniqueList => {
  return names.map((name) => {
    if (allTechsSet.has(name as PracticeTechnique)) {
      return name as PracticeTechnique
    }
    throw new Error(name + ' was not found on techniques!')
  })
}

type Props = {
  onStart: (params: PlayParams) => void
}

export const InputForm: React.FC<Props> = ({ onStart }) => {
  const [formDefaults, setFormDefaults] = useAtom(formState)
  const [setList, setSetList] = useState<SetList>(formDefaults.setList)
  const [validationErrors, setValidationErrors] = useState<z.ZodError | null>(
    null
  )

  const handleSetListChange = (event: SelectChangeEvent<SetList>) => {
    setSetList(event.target.value as SetList)
    setFormDefaults({ ...formDefaults, techset: undefined })
  }

  const onFormAction = (formData: FormData) => {
    const result = InputsSchema.safeParse({
      delay: formData.get('delay'),
      setList: formData.get('setList'),
      shuffle: formData.get('shuffle') === 'on',
      techset: formData.getAll('techset').map((x) => x.toString()),
    })

    if (result.success) {
      const values = result.data
      setValidationErrors(null)
      setFormDefaults(values)

      onStart({
        list: values.techset
          ? practiceTechniqueListFrom(values.techset)
          : setListToKyuList(values.setList),
        delay: values.delay,
        shuffle: values.shuffle,
        listName: values.setList,
      })
    } else {
      setValidationErrors(result.error)
    }
  }

  const errorMap =
    validationErrors !== null
      ? validationErrors.issues.reduce(
          (acc, cur) => {
            return {
              ...acc,
              [cur.path[0]]: cur.message,
            }
          },
          {} as Record<string, string>
        )
      : {}

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

        <FormControl error={!!errorMap.delay}>
          <FormLabel>Kesto (sekuntia)</FormLabel>
          <TextField
            name="delay"
            placeholder="Anna kestoaika sekunteina"
            defaultValue={formDefaults.delay}
            type="number"
            error={!!errorMap.delay}
          />
          <FormHelperText>
            {errorMap.delay
              ? errorMap.delay
              : 'Kuinka monta sekuntia yksittäistä tekniikkaa harjoitellaan.'}
          </FormHelperText>
        </FormControl>
        <Box>
          <Button type="submit" variant="contained">
            Aloita
          </Button>
        </Box>
        <FormControl error={!!errorMap.techset}>
          <FormLabel>Valitse harjoiteltavat tekniikat</FormLabel>
          <FormHelperText>
            {errorMap.techset ? errorMap.techset : ''}
          </FormHelperText>
          <FormGroup
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat( auto-fit, minmax(300px, 1fr) )',
            }}
          >
            {setListToKyuList(setList).map((pt) => (
              <FormControlLabel
                key={pt}
                control={
                  <Checkbox
                    name="techset"
                    key={pt}
                    value={pt}
                    defaultChecked={
                      formDefaults.techset === undefined ||
                      formDefaults.techset.includes(pt)
                    }
                  />
                }
                label={pt}
              />
            ))}
          </FormGroup>
        </FormControl>
      </Box>
    </form>
  )
}
