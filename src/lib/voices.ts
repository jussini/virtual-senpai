import hanmihandachiwaza from '../assets/voice/hanmi_handachiwaza.mp3'
import suwariwaza from '../assets/voice/suwariwaza.mp3'
import ushirowaza from '../assets/voice/ushirowaza.mp3'

import aihanmi_katatedori from '../assets/voice/aihanmi_katatedori.mp3'
import chudan_tsuki from '../assets/voice/chudan_tsuki.mp3'
import jodan_tsuki from '../assets/voice/jodan_tsuki.mp3'
import katadori from '../assets/voice/katadori.mp3'
import katatedori from '../assets/voice/katatedori.mp3'
import katateryotedori from '../assets/voice/katateryotedori.mp3'
import ryotedori from '../assets/voice/ryotedori.mp3'
import shomenuchi from '../assets/voice/shomenuchi.mp3'
import yokomenuchi from '../assets/voice/yokomenuchi.mp3'

import gokyo from '../assets/voice/gokyo.mp3'
import ikkyo from '../assets/voice/ikkyo.mp3'
import iriminage from '../assets/voice/iriminage.mp3'
import jiuwaza from '../assets/voice/jiyuwaza.mp3'
import kokyuho from '../assets/voice/kokyuho.mp3'
import kotegaeshi from '../assets/voice/kotegaeshi.mp3'
import nikyo from '../assets/voice/nikyo.mp3'
import sankyo from '../assets/voice/sankyo.mp3'
import sotokaitennage from '../assets/voice/sotokaitennage.mp3'
import shihonage from '../assets/voice/shihonage.mp3'
import tenchinage from '../assets/voice/tenchinage.mp3'
import uchikaitennage from '../assets/voice/uchikaitennage.mp3'
import yonkyo from '../assets/voice/yonkyo.mp3'

import { Howl } from 'howler'
import {
  Attack,
  ATTACK,
  PracticeTechnique,
  Stance,
  STANCE,
  Technique,
  TECHNIQUE,
} from '../types/techniques'
import { useState } from 'react'

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
    case 'Aihanmi katatedori':
      return aihanmi_katatedori
    case 'Chudan tsuki':
      return chudan_tsuki
    case 'Jodan tsuki':
      return jodan_tsuki
    case 'Katadori':
      return katadori
    case 'Katatedori':
      return katatedori
    case 'Katateryotedori':
      return katateryotedori
    case 'Ryotedori':
      return ryotedori
    case 'Shomenuchi':
      return shomenuchi
    case 'Yokomenuchi':
      return yokomenuchi
    default:
      throw new Error('No voice for ' + attack)
  }
}

const techniqueVoice = (technique: Technique): string => {
  switch (technique) {
    case 'Gokyo':
      return gokyo
    case 'Ikkyo':
      return ikkyo
    case 'Iriminage':
      return iriminage
    case 'Jiyuwaza':
      return jiuwaza
    case 'Kokyoho':
      return kokyuho
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
    case 'Tenchinage':
      return tenchinage
    case 'Uchikaitennage':
      return uchikaitennage
    case 'Yonkyo':
      return yonkyo
    default:
      throw new Error('No voice for ' + technique)
  }
}

const parseTech = (tech: PracticeTechnique): string[] => {
  const stance = STANCE.find((stance) => tech.includes(stance))
  const attack = ATTACK.find((attack) => tech.includes(attack))
  const technique = TECHNIQUE.find((technique) => tech.includes(technique))
  if (attack === undefined || technique === undefined) {
    throw new Error('Could not parse attack or technique from ' + tech)
  }
  return stance
    ? [stanceVoice(stance), attackVoice(attack), techniqueVoice(technique)]
    : [attackVoice(attack), techniqueVoice(technique)]
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
