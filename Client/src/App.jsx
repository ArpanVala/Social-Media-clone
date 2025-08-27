import {Routes, Route} from 'react-router-dom'
import Login from './pages/Login'
import Feed from './pages/Feed'
import Messages from './pages/Messages'
import Connections from './pages/Connections'
import Discover from './pages/Discover'
import Profile from './pages/Profile'
import CreatePost from './pages/CreatePost'
import Signup from './pages/Signup'
import Layout from './pages/Layout'
import { useUser } from '@clerk/clerk-react'
import {Toaster} from 'react-hot-toast'

const App = () => {

  const {user} = useUser();
  return (
   <>
  <Toaster/>
  <Routes>
    <Route path = "/sign-up" element={!user ? <Signup/> : <Layout/>}/>
    <Route path = "/" element={!user ? <Login/> : <Layout/>}>
    {/* for home feed */}
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
    </Route>
    
  </Routes>
   </>
  )
}

export default App
