import VisibilityIcon from '@mui/icons-material/Visibility'
import Typography from '@mui/material/Typography'
import { useEffect, useLayoutEffect, useState } from 'react'

let wakeLockSupported = false
if ('wakeLock' in navigator) {
  wakeLockSupported = true
}

type Params = {
  enabled: boolean
}

const WakeLock: React.FC<Params> = ({ enabled }) => {
  const [lock, setLock] = useState<WakeLockSentinel | null>(null)
  const [visibility, setVisibility] = useState<DocumentVisibilityState>('visible')

  const onVisibilityChange = () => {
    setVisibility(document.visibilityState)
  }

  useLayoutEffect(() => {
    document.addEventListener('visibilitychange', onVisibilityChange)

    return () =>
      document.removeEventListener('visibilitychange', onVisibilityChange)
  }, [])

  useEffect(() => {
    if (!wakeLockSupported) {
      return
    }

    const getLock = async () => {
      try {
        if (visibility === 'visible') {
          const screenLock = await navigator.wakeLock.request('screen')
          screenLock.addEventListener('release', () => {
            setLock(null)
          })
          setLock(screenLock)
        }
      } catch (error) {
        console.warn('Failed to acquire wake lock sentinel', error)
      }
    }

    const releaseLock = async () => {
      try {
        if (lock) {
          await lock.release()
          setLock(null)
        }
      } catch (error) {
        console.warn('Failed to release wake lock sentinel', error)
      }
    }

    if (enabled && !lock && visibility === 'visible') {
      getLock()
    }
    if (!enabled && lock) {
      releaseLock()
    }
  }, [enabled, lock, visibility])

  return (
    <>
      <Typography>{lock ? <VisibilityIcon /> : undefined}</Typography>
    </>
  )
}

export { WakeLock }
