import { atom } from 'jotai'
// import { Inputs } from '../types/input-form'
import { setListToKyuList } from '../util/tech-list'
import { SetList } from '../types/input-form'

type FormInputs = {
  setList: SetList
  shuffle: boolean
  delay: number | string
  techset: string[]
}

export const formState = atom<FormInputs>({
  setList: 'kyu6List',
  shuffle: false,
  delay: 30,
  techset: setListToKyuList('kyu6List'),
})
