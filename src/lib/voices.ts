import hanmihandachiwaza from '../assets/voice/hanmi_handachiwaza.mp3'
import suwariwaza from '../assets/voice/suwariwaza.mp3'
import ushirowaza from '../assets/voice/ushirowaza.mp3'

import omote from '../assets/voice/omote.mp3'
import ura from '../assets/voice/ura.mp3'

import aihanmi_katatedori from '../assets/voice/aihanmi_katatedori.mp3'
import chudan_tsuki from '../assets/voice/chudan_tsuki.mp3'
import eridori from '../assets/voice/eridori.mp3'
import jodan_tsuki from '../assets/voice/jodan_tsuki.mp3'
import katadori from '../assets/voice/katadori.mp3'
import katadori_menuchi from '../assets/voice/katadori_menuchi.mp3'
import katatedori from '../assets/voice/katatedori.mp3'
import katatedori_kubishime from '../assets/voice/katatedori_kubishime.mp3'
import katateryotedori from '../assets/voice/katateryotedori.mp3'
import maegeri from '../assets/voice/maegeri.mp3'
import ryokatadori from '../assets/voice/ryokatadori.mp3'
import ryotedori from '../assets/voice/ryotedori.mp3'
import shomenuchi from '../assets/voice/shomenuchi.mp3'
import toriwaza from '../assets/voice/toriwaza.mp3'
import yokomenuchi from '../assets/voice/yokomenuchi.mp3'

import aikiotoshi from '../assets/voice/aikiotoshi.mp3'
import gokyo from '../assets/voice/gokyo.mp3'
import hijikimeosae from '../assets/voice/hijikimeosae.mp3'
import ikkyo from '../assets/voice/ikkyo.mp3'
import iriminage from '../assets/voice/iriminage.mp3'
import jiuwaza from '../assets/voice/jiyuwaza.mp3'
import jujigarami from '../assets/voice/jujigarami.mp3'
import kokyuho from '../assets/voice/kokyuho.mp3'
import kokyunage from '../assets/voice/kokyunage.mp3'
import koshinage from '../assets/voice/koshinage.mp3'
import kotegaeshi from '../assets/voice/kotegaeshi.mp3'
import nikyo from '../assets/voice/nikyo.mp3'
import sankyo from '../assets/voice/sankyo.mp3'
import sotokaitennage from '../assets/voice/sotokaitennage.mp3'
import sotokaitenosae from '../assets/voice/sotokaitenosae.mp3'
import shihonage from '../assets/voice/shihonage.mp3'
import tenchinage from '../assets/voice/tenchinage.mp3'
import uchikaitennage from '../assets/voice/uchikaitennage.mp3'
import uchikaiten_sankyo from '../assets/voice/uchikaiten_sankyo.mp3'
import udekimenage from '../assets/voice/udekimenage.mp3'
import yonkyo from '../assets/voice/yonkyo.mp3'

import { Howl } from 'howler'
import {
  Attack,
  ATTACK,
  DIRECTION,
  Direction,
  PracticeTechnique,
  Stance,
  STANCE,
  Technique,
  TECHNIQUE,
} from '../types/techniques'
import { useState } from 'react'

const directionVoice = (direction: Direction): string => {
  switch (direction) {
    case 'Omote':
      return omote
    case 'Ura':
      return ura
    default:
      throw new Error('No voice for ' + direction)
  }
}

const stanceVoice = (stance: Stance): string => {
  switch (stance) {
    case 'Suwariwaza':
      return suwariwaza
    case 'Hanmi handachiwaza':
      return hanmihandachiwaza
    case 'Ushirowaza':
      return ushirowaza
    default:
      throw new Error('No voice for ' + stance)
  }
}

const attackVoice = (attack: Attack): string => {
  switch (attack) {
    case 'Aihanmi-katatedori':
      return aihanmi_katatedori
    case 'Chudan-tsuki':
      return chudan_tsuki
    case 'Eridori':
      return eridori
    case 'Jodan-tsuki':
      return jodan_tsuki
    case 'Katadori':
      return katadori
    case 'Katadori-menuchi':
      return katadori_menuchi
    case 'Katatedori':
      return katatedori
    case 'Katatedori-kubishime':
      return katatedori_kubishime
    case 'Katateryotedori':
      return katateryotedori
    case 'Maegeri':
      return maegeri
    case 'Ryokatadori':
      return ryokatadori
    case 'Ryotedori':
      return ryotedori
    case 'Shomenuchi':
      return shomenuchi
    case 'Toriwaza':
      return toriwaza
    case 'Yokomenuchi':
      return yokomenuchi
    default:
      throw new Error('No voice for ' + attack)
  }
}

const techniqueVoice = (technique: Technique): string => {
  switch (technique) {
    case 'Aikiotoshi':
      return aikiotoshi
    case 'Gokyo':
      return gokyo
    case 'Hijikimeosae':
      return hijikimeosae
    case 'Ikkyo':
      return ikkyo
    case 'Iriminage':
      return iriminage
    case 'Jiyuwaza':
      return jiuwaza
    case 'Jujigarami':
        return jujigarami
    case 'Kokyuho':
      return kokyuho
    case 'Kokyunage':
      return kokyunage
    case 'Koshinage':
      return koshinage
    case 'Kotegaeshi':
      return kotegaeshi
    case 'Nikyo':
      return nikyo
    case 'Sankyo':
      return sankyo
    case 'Shihonage':
      return shihonage
    case 'Sotokaitennage':
      return sotokaitennage
    case 'Sotokaitenosae':
      return sotokaitenosae      
    case 'Tenchinage':
      return tenchinage
    case 'Uchikaitennage':
      return uchikaitennage
    case 'Uchikaiten-sankyo':
      return uchikaiten_sankyo
    case 'Udekimenage':
        return udekimenage
    case 'Yonkyo':
      return yonkyo
    default:
      throw new Error('No voice for ' + technique)
  }
}

const parseTech = (tech: PracticeTechnique): string[] => {
  const techSplit = tech.split(' ')
  const stance = STANCE.find((stance) => tech.includes(stance))
  const attack = ATTACK.find((attack) => techSplit.includes(attack))
  const technique = TECHNIQUE.find((technique) => tech.includes(technique))
  const direction = DIRECTION.find((direction) => tech.includes(direction))
  if (attack === undefined || technique === undefined) {
    throw new Error('Could not parse attack or technique from ' + tech)
  }

  const parts = []
  if (stance) {
    parts.push(stanceVoice(stance))
  }

  parts.push(attackVoice(attack))
  parts.push(techniqueVoice(technique))

  if (direction) {
    parts.push(directionVoice(direction))
  }

  return parts
}

export const useVoice = () => {
  const [playing, setPlaying] = useState(false)

  const play = (tech: PracticeTechnique) => {
    const list = parseTech(tech)
    if (!playing && list.length > 0) {
      const playpromise = new Promise<void>((resolve) => {
        const autoplay = (i: number, list: string[]) => {
          const sound = new Howl({
            src: [list[i]],
            preload: true,
            onend: () => {
              if (i + 1 < list.length) {
                autoplay(i + 1, list)
              } else {
                setPlaying(false)
                resolve()
              }
            },
          })
          sound.play()
        }
        autoplay(0, list)
      })

      setPlaying(true)
      return playpromise
    }
    return Promise.resolve()
  }

  return { play, playing }
}
