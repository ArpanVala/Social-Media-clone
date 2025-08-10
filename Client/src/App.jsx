import React from 'react'
import { assets } from './assets/assets'

const App = () => {
  return (
    <h1 class="text-3xl text-center font-light text-gray-9 flex items-center justify-center h-screen gap-10 ">
  Welcome to Atom <img src={assets.logo} alt="logo" width={60} height={60} />
  </h1>
  )
}

export default App
