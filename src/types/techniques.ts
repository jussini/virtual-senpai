export const STANCE = [
  'Hanmi handachiwaza',
  'Tachiwaza',
  'Suwariwaza',
  'Ushirowaza',
] as const

export const DIRECTION = ['Omote', 'Ura']

export const ATTACK = [
  'Aihanmi-katatedori',
  'Chudan-tsuki',
  'Eridori',
  'Jodan-tsuki',
  'Katadori',
  'Katadori-menuchi',
  'Katatedori',
  'Katatedori-kubishime',
  'Katateryotedori',
  'Maegeri',
  'Munedori',
  'Ryokatadori',
  'Ryotedori',
  'Shomenuchi',
  'Toriwaza',
  'Yokomenuchi',
] as const

export const TECHNIQUE = [
  'Aikiotoshi',
  'Gokyo',
  'Hijikimeosae',
  'Ikkyo',
  'Iriminage',
  'Jiyuwaza',
  'Kokyuho',
  'Kokyunage',
  'Kotegaeshi',
  'Koshinage',
  'Nikyo',
  'Sankyo',
  'Shihonage',
  'Sotokaitennage',
  'Tenchinage',
  'Uchikaitennage',
  'Uchikaiten-sankyo',
  'Yonkyo',
] as const

export type Stance = (typeof STANCE)[number]
export type Direction = (typeof DIRECTION)[number]
export type Attack = (typeof ATTACK)[number]
export type Technique = (typeof TECHNIQUE)[number]
export type PracticeTechnique =
  | `${Stance} ${Attack} ${Technique} ${Direction}`
  | `${Attack} ${Technique} ${Direction}`
  | `${Stance} ${Attack} ${Technique}`
  | `${Attack} ${Technique}`
export type PracticeTechniqueParts =
  | [Stance, Attack, Technique, Direction]
  | [Attack, Technique, Direction]
  | [Stance, Attack, Technique]
  | [Attack, Technique]
export type PracticeTechniqueList = Array<PracticeTechnique>
