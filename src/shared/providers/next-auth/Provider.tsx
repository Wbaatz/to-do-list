'use client';

import { SessionProvider } from 'next-auth/react'
import React from 'react'

interface providerProps{
    children : any
}

const NextAuthProvider:React.FC<providerProps> =  ({children}) => {
  return (
    <SessionProvider>{children}</SessionProvider>
  )
}

export default NextAuthProvider;