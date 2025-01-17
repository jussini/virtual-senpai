export const STANCE = [
  'Tachiwaza',
  'Suwariwaza',
  'Hanmi handachiwaza',
  'Ushirowaza',
] as const

export const ATTACK = [
  'Aihanmi katatedori',
  'Katatedori',
  'Katadori',
  'Ryotedori',
  'Katateryotedori',
  'Munedori',
  'Eridori',
  'Yokomenuchi',
  'Shomenuchi',
  'Jodan tsuki',
  'Chudan tsuki',
] as const

export const TECHNIQUE = [
  'Ikkyo',
  'Nikyo',
  'Sankyo',
  'Yonkyo',
  'Gokyo',
  'Kotegaeshi',
  'Iriminage',
  'Kokyoho',
  'Kokyunage',
  'Shihonage',
  'Tenchinage',
  'Jiyuwaza',
  'Sotokaitennage',
  'Uchikaitennage',
] as const

export type Stance = (typeof STANCE)[number]
export type Attack = (typeof ATTACK)[number]
export type Technique = (typeof TECHNIQUE)[number]
export type PracticeTechnique =
  | `${Stance} ${Attack} ${Technique}`
  | `${Attack} ${Technique}`
export type PracticeTechniqueParts =
  | [Stance, Attack, Technique]
  | [Attack, Technique]
export type PracticeTechniqueList = Array<PracticeTechnique>
