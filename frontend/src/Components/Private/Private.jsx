import React from 'react'
import { Navigate } from 'react-router-dom'

const Private = ({children}) => {
    const auth = localStorage.getItem("tkn-at-udb")
  return auth ? children : <Navigate to="/signup" />
}

export default Private