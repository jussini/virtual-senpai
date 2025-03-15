import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import FormLabel from '@mui/material/FormLabel'
import MenuItem from '@mui/material/MenuItem'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import Switch from '@mui/material/Switch'
import React, { ChangeEvent, useState } from 'react'
import { PracticeTechnique, PracticeTechniqueList } from '../types/techniques'

import { PlayParams } from '../types/play-params'
import Button from '@mui/material/Button'
import { useAtom } from 'jotai'
import { Checkbox, FormControlLabel, FormGroup, TextField } from '@mui/material'
import { InputsSchema, SetList } from '../types/input-form'
import { formState } from '../atoms/atoms'
import { setListNames } from '../constants/setLists'
import { z } from 'zod'
import { setListToKyuList } from '../util/tech-list'

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
  const [formValues, setFormValues] = useAtom(formState)
  const [validationErrors, setValidationErrors] = useState<z.ZodError | null>(
    null
  )

  const handleSetListChange = (event: SelectChangeEvent<SetList>) => {
    const setList = event.target.value as SetList
    setFormValues({
      ...formValues,
      setList,
      techset: setListToKyuList(setList),
    })
  }

  const handleShuffleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormValues({ ...formValues, shuffle: event.target.checked })
  }

  const handleDelayChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormValues({ ...formValues, delay: Number(event.target.value) })
  }

  const handleTechsetCheckbox = (name: string, checked: boolean) => {
    const currentTechSet = new Set(formValues.techset)
    if (checked) {
      currentTechSet.add(name)
    } else {
      currentTechSet.delete(name)
    }
    setFormValues({ ...formValues, techset: Array.from(currentTechSet) })
  }

  const handleStartButtonClick = () => {
    const result = InputsSchema.safeParse({
      delay: formValues.delay,
      setList: formValues.setList,
      shuffle: formValues.shuffle,
      techset: formValues.techset,
    })

    if (result.success) {
      const values = result.data
      setValidationErrors(null)

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
          value={formValues.setList}
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
        <Switch
          name="shuffle"
          checked={formValues.shuffle}
          onChange={handleShuffleChange}
        />
        <FormHelperText>Käydäänkö lista läpi sekoitettuna?</FormHelperText>
      </FormControl>

      <FormControl error={!!errorMap.delay}>
        <FormLabel>Kesto (sekuntia)</FormLabel>
        <TextField
          name="delay"
          placeholder="Anna kestoaika sekunteina"
          value={formValues.delay}
          onChange={handleDelayChange}
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
        <Button variant="contained" onClick={handleStartButtonClick}>
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
          {setListToKyuList(formValues.setList).map((pt) => (
            <FormControlLabel
              key={pt}
              control={
                <Checkbox
                  name="techset"
                  key={pt}
                  value={pt}
                  onChange={(ev) =>
                    handleTechsetCheckbox(pt, ev.currentTarget.checked)
                  }
                  checked={formValues.techset?.includes(pt) ?? true}
                />
              }
              label={pt}
            />
          ))}
        </FormGroup>
      </FormControl>
    </Box>
  )
}
