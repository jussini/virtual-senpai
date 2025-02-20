import LinearProgress from '@mui/material/LinearProgress'
import React, { useEffect, useState } from 'react'
import { useElapsedTime } from 'use-elapsed-time'

const END_WARNING_MARGIN = 7

export const Progress: React.FC<{
  duration: number
  onEnd: () => void
  isActive: boolean
  onEndWarning: () => void
}> = ({ duration, onEnd, isActive, onEndWarning }) => {
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
  const [endWarningSignaled, setEndWarningSignaled] = useState(false)

  useEffect(() => {
    if (
      duration > END_WARNING_MARGIN &&
      duration - elapsedTime < END_WARNING_MARGIN &&
      !endWarningSignaled
    ) {
      setEndWarningSignaled(true)
      onEndWarning()
    }
  }, [duration, elapsedTime, endWarningSignaled, onEndWarning])

  const value = (elapsedTime / duration) * 100

  return <LinearProgress variant="determinate" value={Number(value)} />
}
