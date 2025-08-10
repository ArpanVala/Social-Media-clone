import React from 'react'
import { assets } from './assets/assets'
import {Routes, Route} from 'react-router-dom'
import Login from './pages/Login'
import Feed from './pages/Feed'
import Messages from './pages/Messages'
import Connections from './pages/Connections'
import Discover from './pages/Discover'
import Profile from './pages/Profile'
import CreatePost from './pages/CreatePost'

const App = () => {
  return (
   <>

  <Routes>
    <Route path = "/login" element={<Login/>}/>
    <Route index element={<Feed/>}/>
    {/* for list of prople messages  */}
    <Route path="messages" element={<Messages/>}/>
    {/* for individual message thread */}
    <Route path="meassages/:userId" element={<Messages/>}/>

    <Route path="connections" element={<Connections/>}/>
    <Route path="discover" element={<Discover/>}/>

    {/* for user profile */}
    <Route path="profile" element={<Profile/>}/>
    {/* for individual profile on platform */}
    <Route path="profile/:profileId" element={<Profile/>}/>

    <Route path="create-post" element={<CreatePost/>}/>


    
  </Routes>
   </>
  )
}

export default App
