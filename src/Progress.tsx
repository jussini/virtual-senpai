import LinearProgress from '@mui/material/LinearProgress'
import React from 'react'
import { useElapsedTime } from 'use-elapsed-time'

export const Progress: React.FC<{
  duration: number
  onEnd: () => void
  isActive: boolean
}> = ({ duration, onEnd, isActive }) => {
  const { elapsedTime } = useElapsedTime({
    isPlaying: isActive,
    duration: duration,
    onComplete: () => {
      // visual nicety: progress bar gets some time to animate to full before being removed.
      // It also somehow breaks the howler on iOS, so don't use if for now.
      //setTimeout(() => {
      onEnd()
      //}, 1000)
    },
    updateInterval: 1,
  })

  const value = (elapsedTime / duration) * 100

  return <LinearProgress variant="determinate" value={Number(value)} />
}
