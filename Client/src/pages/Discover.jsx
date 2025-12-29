import React, { useState } from 'react'
import { Search } from 'lucide-react';
import UserCard from '../components/UserCard';
import Loading from '../components/Loading';
import api from '../api/axios';
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { fetchUser } from '../features/userSlice.js';
import { useNavigate } from 'react-router-dom';

const Discover = () => {
  const [input, setInput] = useState('Arpan');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const {getToken} = useAuth();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const handleSearch = async(e) => {
    if(e ? e.key == 'Enter' : true)
      {
        try {
          setUsers([]);
        setLoading(true);
        const {data} = await api.post('/api/user/discover', {input}, {
          headers: { Authorization: `Bearer ${await getToken()}` }
        });

        data.success ? setUsers(data.users) : toast.error(data.message);
        setLoading(false);
        setInput('');
          
        } catch (error) {
          toast.error(error.message);
        }
        setLoading(false);

      }

  }

  useEffect(()=>{
    getToken().then(token => dispatch(fetchUser(token)))
    handleSearch()
  },[])

  return (
    <div className='max-h-screen'>
      {/* <div className='max-w-6xl mx-auto p-6 relative h-[100vh] overflow-y-auto no-scrollbar'> */}

      <div className='max-w-6xl mx-auto p-6 h-full'>
       {/* title  */}
        <div className='mb-8'>
          <h1 className='text-2xl font-semibold text-slate-800 '>Discover</h1>
          <h6 className='text-lg text-slate-600'>Connect with amazing people and grow your network</h6>
        </div>

        {/* input search */}
        <div className='mb-8 shadow-md border border-slate-200 bg-white'>
          <div className='p-6'>
            <div className='relative '>
              <Search className='w-5 h-5 absolute top-1/2 left-3 -translate-y-1/2'/>
              <input type="text" placeholder='Search people... ' value={input} onChange={(e)=>setInput(e.target.value)}
                onKeyUp={handleSearch}
                className='pl-10 sm:pl-12 py-2 w-full border border-gray-300 rounded-md outline-none'
                autoFocus
              />
            </div>
          </div>
        </div>

        {/* list of users  */}
        <div className='w-full'>
          <div className='flex flex-wrap gap-6  max-md:justify-center max-md:w-fit mx-auto'>
          {
            users.map((user,index)=>(
              // console.log(user)
              <UserCard key={index} user={user} onClick={()=> navigate('/profile/' + user._id)}/>
            ))
          }
          
          

          {/* loader  */}

          {
            loading && <Loading height='40vh'/>

          }

          </div>
        </div>


      </div>

    </div>
  )
}

export default Discover
