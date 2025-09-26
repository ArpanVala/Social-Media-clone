import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MessageCircle, UserCheck, UserPlus, UserRoundPen, Users } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { useAuth } from '@clerk/clerk-react'
import { fetchConnections } from '../features/connectionSlice.js'
import toast from 'react-hot-toast'
import api from '../api/axios.js'

const Connections = () => {
  const [currentTab, setCurrentTab] = React.useState('Followers');

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {getToken} = useAuth();

  const {connections, pendingConnections, followers, following} = useSelector((state) => state.connections);


  const dataArray = [
     {label: 'Followers', value: followers, icon: Users},
     {label: 'Following', value: following, icon: UserCheck},
     {label: 'Pending', value: pendingConnections, icon: UserRoundPen},
     {label: 'Connections', value: connections, icon: UserPlus},
  ]

  //handle unfollow
  const handleUnfollow = async(userId) => {
    {
      try {
        
        const {data} = await api.post('/api/user/unfollow', {id:userId}, {
          headers: { Authorization: `Bearer ${await getToken()}` }
        })
        if(data.success)
        {
          toast.success(data.message);
          dispatch(fetchConnections(await getToken()));
        }
        else{
          toast.error(data.message);
          console.log(data);
        }
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
        
      }
    }

     //accept connection 
  const acceptConnection = async(userId) => {
    {
      try {
        const {data} = await api.post('/api/user/accept', {id:userId}, {
          headers: { Authorization: `Bearer ${await getToken()}` }
        })
        if(data.success)
        {
          toast.success(data.message);
          dispatch(fetchConnections(await getToken()));
        }
        else{
          toast.error(data.message);
          console.log(data);
        }
      } catch (error) {
        toast.error(error.message);
        console.log(error);
      }
        
      }
    }

  useEffect(()=>{
    getToken().then(token => dispatch(fetchConnections(token)));
  },[])
  return (
    <div className='max-h-screen'>
      <div className='max-w-6xl mx-auto p-6'>
          {/* title  */}
        <div className='mb-8'>
          <h1 className='text-2xl font-semibold text-slate-800 '>Connections</h1>
          <h6 className='text-lg text-slate-600'>Manage your network and discover new connections</h6>
        </div>

        {/* followers, following etc counts  */}
          <div className='flex mb-8 gap-6 flex-wrap'>
           {
            dataArray.map((item, index) => (
              <div className='flex flex-col items-center justify-center gap-1  border-2  border-gray-200 h-20 w-40 bg-white shadow rounded' key={index}>
                <p>{item.value.length}</p>
                <p className='text-slate-500'>{item.label}</p>
              </div>
            ))
           }
          </div> 


          {/* Tabs  */}
          <div className='inline-flex flex-wrap gap-3  items-center border border-gray-200 rounded p-1 bg-white shadow'>
          {
            dataArray.map((tab, idx) => (
              <button
                key={tab.label}
                className={`cursor-pointer flex items-center px-3 py-1 text-sm rounded  transition-colors ${currentTab === tab.label ? 'bg-white font-medium text-black border-2 border-slate-300' : 'text-gray-500  hover:text-black hover:bg-gray-200'}`}
                onClick={() => setCurrentTab(tab.label)}
              >
                <tab.icon size={14}/>
                <span className='ml-1'>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className='ml-2 text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full'>
                    {tab.count}
                  </span>)}
              </button>
            ))
          }
          </div>
          
          {/* connections  */}
          <div className='flex flex-wrap gap-6 mt-8'>
          {
            dataArray.find((item)=> item.label === currentTab)?.value.map((user) => (
              <div className='bg-white shadow-md rounded-md max-w-88 flex gap-5 w-full p-5' key={user._id}>
                <img src={user.profile_picture} alt="profile picture" className='w-12 h-12 rounded-full shadow-md ' />
                <div className='flex-1 text-sm'>
                  <p className='font-semibold text-slate-700'>{user.full_name}</p>
                  <p className='font-light text-slate-500'>@{user.username}</p>
                  <p className='font-light text-slate-600'>{user.bio.slice(0, 50)}...</p>

                  <div className='flex max-sm:flex-col gap-2 mt-4'>
                {
                <button className='w-full p-2 text-sm bg-gradient-to-r rounded-md from-indigo-500 to-purple-600  text-white transition active:scale-95 cursor-pointer' 
                onClick={()=> navigate(`/profile/${user._id}`)}
                >View Profile
                </button>
                
                }
                {
                  currentTab === 'Following' && (
                    <button onClick={()=> handleUnfollow(user._id)} className='w-full p-2 text-sm bg-slate-100 rounded-md hover:bg-slate-200 transition active:scale-95 cursor-pointer'>Unfollow
                    </button>
                  )
                }

                 {
                  currentTab === 'Pending' && (
                    <button onClick={()=> acceptConnection(user._id)}  className='w-full p-2 text-sm bg-slate-100 rounded-md hover:bg-slate-200 transition active:scale-95 cursor-pointer'>Accept
                    </button>
                  )
                }

                 {
                  currentTab === 'Connections' && (
                    <button className='w-full flex  items-center gap-2  justify-center p-2 text-sm bg-slate-100 rounded-md hover:bg-slate-200 transition active:scale-95 cursor-pointer'
                    onClick={()=> navigate(`/messages/${user._id}`)}>
                    <MessageCircle size={14}/>
                    Message
                    </button>
                  )
                }
                


                </div>
                </div>

                
              
              </div>
            ))
          }

          </div>


          </div>
      </div>

  )
}

export default Connections
