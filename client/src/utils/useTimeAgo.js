import { useState, useEffect } from 'react'
import { formatDistanceToNowStrict } from 'date-fns'
import { enUS } from 'date-fns/locale'

export function useTimeAgo(timestamp) {
  const [label, setLabel] = useState('')

  useEffect(() => {

    if(!timestamp){
      return;
    }
    const updateLabel = () => {
      let result = formatDistanceToNowStrict(new Date(timestamp), {
        locale: enUS,
      })

      result = result
        .replace(/ less than a minute/, '0 min')
        .replace(/ minutes?/, 'min')
        .replace(/ hours?/,   'h')
        .replace(/ days?/,    'd')
        .replace(/ months?/,  'mo')
        .replace(/ years?/,   'y')

      setLabel(result)
    }

    updateLabel()
    const intervalId = setInterval(updateLabel, 60_000)
    return () => clearInterval(intervalId)
  }, [timestamp])

  return label
}
