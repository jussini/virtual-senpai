import Box from '@mui/material/Box'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import FormHelperText from '@mui/material/FormHelperText'
import FormLabel from '@mui/material/FormLabel'
import MenuItem from '@mui/material/MenuItem'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import Switch from '@mui/material/Switch'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import React, { ChangeEvent, useState } from 'react'
import { PracticeTechnique, PracticeTechniqueList } from '../types/techniques'
import { PlayParams } from '../types/play-params'
import { useAtom } from 'jotai'
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
  const [techSetExpanded, setTechsetExpanded] = useState(false)

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
    setFormValues({ ...formValues, delay: event.target.value })
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

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
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
    <form onSubmit={handleFormSubmit}>
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
          <FormHelperText>
            {formValues.shuffle
              ? 'Lista käydään läpi sekoitettuna.'
              : 'Lista käydään läpi järjestyksessä.'}
          </FormHelperText>
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
        <Accordion
          expanded={errorMap.techset ? true : techSetExpanded}
          onChange={(_, expanded) => setTechsetExpanded(expanded)}
        >
          <AccordionSummary
            expandIcon={<ArrowDownwardIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <Typography component="span">
              Tarkenna harjoiteltavat tekniikat ({formValues.techset.length}/
              {setListToKyuList(formValues.setList).length})
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormControl error={!!errorMap.techset} sx={{ width: '100%' }}>
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
          </AccordionDetails>
        </Accordion>
        <Box>
          <Button variant="contained" type="submit">
            Aloita
          </Button>
        </Box>
      </Box>
    </form>
  )
}
