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
import { SetList } from '../types/input-form'
import { PracticeTechniqueList } from '../types/techniques'

export const setListToKyuList = (listName: SetList): PracticeTechniqueList => {
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
