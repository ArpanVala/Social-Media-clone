import React, { useState } from 'react'
import { dummyConnectionsData } from '../assets/assets';
import { Search } from 'lucide-react';
import UserCard from '../components/UserCard';
import Loading from '../components/Loading';

const Discover = () => {
  const [input, setInput] = useState('');
  const [users, setUsers] = useState(dummyConnectionsData);
  const [loading, setLoading] = useState(false);

  const handleSearch = async(e) => {
    if(e.key == 'Enter')
      {
        setUsers([]);
        setLoading(true);
        setTimeout(()=>{

          setUsers(dummyConnectionsData);
          setLoading(false);
        },1000)
      }
  }

  return (
    <div className='max-h-screen'>
      <div className='max-w-6xl mx-auto p-6'>
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
        <div className='flex flex-wrap gap-6'>
        {
          users.map((user,index)=>(
            <UserCard key={index} user={user} />
          ))
        }
        
        

        {/* loader  */}

        {
          loading && <Loading height='40vh'/>

        }

        </div>


      </div>

    </div>
  )
}

export default Discover
