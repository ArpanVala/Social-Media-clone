import React, { useState } from 'react'
import { Search } from 'lucide-react';
import UserCard from '../components/UserCard';
import PostCard from '../components/PostCard';
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
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profiles'); // 'profiles' or 'posts'
  const { getToken } = useAuth();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const handleSearch = async (e) => {
    if (e ? e.key == 'Enter' : true) {
      try {
        setUsers([]);
        setPosts([]);
        setLoading(true);

        // Fetch both posts and profiles simultaneously
        const token = await getToken();
        const [usersResponse, postsResponse] = await Promise.all([
          api.post('/api/user/discover', { input }, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          api.post('/api/post/discover', { input }, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        if (usersResponse.data.success) {
          setUsers(usersResponse.data.users);
        } else {
          toast.error(usersResponse.data.message);
        }

        if (postsResponse.data.success) {
          setPosts(postsResponse.data.posts);
        } else {
          toast.error(postsResponse.data.message);
        }

        setLoading(false);
        setInput('');

      } catch (error) {
        toast.error(error.message);
        setLoading(false);
      }

    }

  }

  useEffect(() => {
    getToken().then(token => dispatch(fetchUser(token)))
    handleSearch()
  }, [])

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
              <Search className='w-5 h-5 absolute top-1/2 left-3 -translate-y-1/2' />
              <input type="text" placeholder='Search people or posts...' value={input} onChange={(e) => setInput(e.target.value)}
                onKeyUp={handleSearch}
                className='pl-10 sm:pl-12 py-2 w-full border border-gray-300 rounded-md outline-none'
                autoFocus
              />
            </div>
          </div>

          {/* Tabs */}
          <div className='px-6 pb-4'>
            <div className='flex gap-2 border-t border-gray-200 pt-4'>
              <button
                onClick={() => setActiveTab('profiles')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'profiles'
                  ? 'bg-indigo-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
                  }`}
              >
                Profiles {users.length > 0 && `(${users.length})`}
              </button>
              <button
                onClick={() => setActiveTab('posts')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'posts'
                  ? 'bg-indigo-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
                  }`}
              >
                Posts {posts.length > 0 && `(${posts.length})`}
              </button>
            </div>
          </div>
        </div>

        {/* list of users or posts  */}
        <div className='w-full'>
          {activeTab === 'profiles' ? (
            <div className='flex flex-wrap gap-6  max-md:justify-center max-md:w-fit mx-auto'>
              {
                users.map((user, index) => (
                  <UserCard key={index} user={user} onClick={() => navigate('/profile/' + user._id)} />
                ))
              }
              {loading && <Loading height='40vh' />}
            </div>
          ) : (
            <div className='flex flex-col items-center gap-6'>
              {
                posts.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))
              }
              {loading && <Loading height='40vh' />}
            </div>
          )}
        </div>


      </div>

    </div>
  )
}

export default Discover
