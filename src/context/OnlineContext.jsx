import { createContext, useContext, useEffect, useState } from 'react'
import { contarPendentes } from '../lib/localdb'
import { aoMudarStatusSync, tentarSincronizar } from '../lib/sync'

const OnlineContext = createContext(null)

export function OnlineProvider({ children }) {
  const [online, setOnline] = useState(typeof navigator === 'undefined' ? true : navigator.onLine)
  const [pendentes, setPendentes] = useState(0)

  useEffect(() => {
    function aoFicarOnline() { setOnline(true); tentarSincronizar() }
    function aoFicarOffline() { setOnline(false) }
    window.addEventListener('online', aoFicarOnline)
    window.addEventListener('offline', aoFicarOffline)
    contarPendentes().then(setPendentes)
    const cancelar = aoMudarStatusSync(setPendentes)
    return () => {
      window.removeEventListener('online', aoFicarOnline)
      window.removeEventListener('offline', aoFicarOffline)
      cancelar()
    }
  }, [])

  return (
    <OnlineContext.Provider value={{ online, pendentes }}>
      {children}
    </OnlineContext.Provider>
  )
}

export function useOnline() {
  return useContext(OnlineContext)
}
