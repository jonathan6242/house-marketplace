import { useEffect, useState } from "react"
import { auth } from "../firebase.config"
import { onAuthStateChanged } from "firebase/auth"

function useAuthStatus() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [checkingStatus, setCheckingStatus] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if(user) {
        setLoggedIn(true)
      }
      setCheckingStatus(false)
    })
    return unsubscribe
  }, [])

  return {loggedIn, checkingStatus}
}
export default useAuthStatus