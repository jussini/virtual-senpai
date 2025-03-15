import { atom } from 'jotai'
import { Inputs } from '../types/input-form'
import { setListToKyuList } from '../util/tech-list'

export const formState = atom<Inputs>({
  setList: 'kyu6List',
  shuffle: false,
  delay: 30,
  techset: setListToKyuList('kyu6List'),
})
