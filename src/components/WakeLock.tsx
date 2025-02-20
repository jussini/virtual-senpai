import VisibilityIcon from '@mui/icons-material/Visibility'
import Typography from '@mui/material/Typography'
import { useEffect, useState } from 'react'

let wakeLockSupported = false
if ('wakeLock' in navigator) {
  wakeLockSupported = true
}

type Params = {
  enabled: boolean
}

const WakeLock: React.FC<Params> = ({ enabled }) => {
  const [lock, setLock] = useState<WakeLockSentinel | null>(null)

  useEffect(() => {
    if (!wakeLockSupported) {
      return
    }

    const getLock = async () => {
      try {
        const screenLock = await navigator.wakeLock.request('screen')
        screenLock.addEventListener('release', () => {
          console.log('wake lock was released')
        })
        setLock(screenLock)
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

    if (enabled && (!lock || lock.released)) {
      getLock()
    }
    if (!enabled && lock) {
      releaseLock()
    }
  }, [enabled, lock])

  return (
    <>
      <Typography>{lock ? <VisibilityIcon /> : undefined}</Typography>
    </>
  )
}

export { WakeLock }
