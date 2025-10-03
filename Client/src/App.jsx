import {Routes, Route, useLocation} from 'react-router-dom'
import Login from './pages/Login'
import Feed from './pages/Feed'
import Messages from './pages/Messages'
import Connections from './pages/Connections'
import Discover from './pages/Discover'
import Profile from './pages/Profile'
import CreatePost from './pages/CreatePost'
import Signup from './pages/Signup'
import Layout from './pages/Layout'
import { useUser,useAuth } from '@clerk/clerk-react'
import toast, {Toaster} from 'react-hot-toast'
import ChatBox from './pages/ChatBox'
import { useEffect } from 'react'
import {useDispatch} from 'react-redux'
import { fetchUser } from './features/userSlice.js'
import { fetchConnections } from './features/connectionSlice'
import { useRef } from 'react'
import { addMessage } from './features/messageSlice.js'
import Notifications from './components/Notifications.jsx'

const App = () => {

  const {user} = useUser();
  const {getToken} = useAuth();
  const pathname = useLocation();
  const pathnameref = useRef(pathname);

  const dispatch = useDispatch();

  useEffect(()=>{
    const fetchData = async ()=>{
      if(user)
    {
      const token = await getToken();
      dispatch(fetchUser(token)); //fetch user details from backend
      dispatch(fetchConnections(token)); //fetch user connections from backend
    }
    }
    fetchData();
    
  },[user, getToken, dispatch])


  useEffect(()=>{
    pathnameref.current = pathname;
  }, [pathname]);

  useEffect(()=>{

    if(user)
    {
      const eventSource = new EventSource(import.meta.VITE_BASEURL + '/api/message/' + user.id);
      eventSource.onmessage = (event) => {
        const message = JSON.parse(event.data);

        if(pathnameref.current === ('/messages/' + message.from_user_id._id))
        {
          // user is on the chat page of the sender or receiver
          dispatch(addMessage(message));
        }
        else
        {
          // user is not on the chat page of the sender or receiver
          toast.custom((t)=>(<Notifications t={t} message={message}/>),
        {position: 'bottom-right'})
        }
      } 
      return () =>{
        eventSource.close();
      }
    }
  },[])

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
    <Route path="messages/:userId" element={<ChatBox/>}/>

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
