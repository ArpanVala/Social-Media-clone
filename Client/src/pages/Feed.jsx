import React, { useEffect, useState } from 'react'
import { assets, dummyPostsData } from '../assets/assets';
import Loading from '../components/Loading';
import StoryCards from '../components/StoryCards';
import PostCard from '../components/PostCard';
import { Megaphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import RecentMessages from '../components/RecentMessages';
import { useAuth } from '@clerk/clerk-react';
import api from '../api/axios.js';
import toast from 'react-hot-toast';

const Feed = () => {
  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();

  //fech posts
  const fetchFeeds = async () => {

    try {
      setLoading(true);
      const { data } = await api.get('/api/post/feed', {
        headers: { Authorization: `Bearer ${await getToken()}` }
      });

      if (data.success) setFeeds(data.posts);
      else toast.error(data.message);

    } catch (error) {
      console.log(error);
      toast.error(error.message);

    }
    setLoading(false);
  }

  //call when page initalize
  useEffect(() => {
    fetchFeeds();
    setLoading(false);
  }, []);


  return !loading ? (
    <>

      <div className=' h-full overflow-y-scroll no-scrollbar py-10 xl:pr-5 flex items-start md:justify-center xl:gap-8 '>

  
        {/* stories and posts */}
        <div className='w-full max-w-2xl mx-auto px-4 sm:px-0'>
          <StoryCards/>
          <div className='p-1 sm:p-3 mt-4 space-y-4 '>
            {feeds.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        </div>

        {/* ad + messages  */}
        <div className='max-xl:hidden sticky top-0'>
          {/* ad  */}
          <div className='max-w-xs bg-plain text-xs p-4 group rounded-md  shadow hover:shadow-xl cursor-pointer relative'>
            <a href="https://goalsetter-arpanvala.netlify.app/" target='_blank' className='flex flex-col gap-2'>
              <h3 className='text-subtitle inline-flex gap-1 items-center font-semibold'>AD <Megaphone size={16} /></h3>
              <div className='overflow-hidden rounded-md'>
                <img src={assets.sponsored_img} alt="ad image" className='w-full h-full object-cover group-hover:scale-103 transition duration-500' />
              </div>

              <p className='text-title group-hover:text-accent'>GoalSetter - Arpan Vala</p>
              <p className='text-subtitle'>Achieve your goals with personalized categories and easy tracking.</p>
            </a>
          </div>

          <div>
            <RecentMessages />
          </div>
        </div>
      </div>

    </>
  ) : (
    <Loading />
  )
}

export default Feed
