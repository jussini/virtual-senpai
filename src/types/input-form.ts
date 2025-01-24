export type Inputs = {
  setList: SetList
  shuffle: boolean
  delay: number
}

export type SetList =
  | 'kyu6List'
  | 'kyu5List'
  | 'kyu4List'
  | 'kyu3List'
  | 'kyu2List'
  | 'kyu1List'
  | 'kyu1List2007'