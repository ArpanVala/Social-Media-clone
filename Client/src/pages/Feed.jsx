import React, { useEffect, useState } from 'react'
import { assets, dummyPostsData } from '../assets/assets';
import Loading from '../components/Loading';
import StoryCards from '../components/StoryCards';
import PostCard from '../components/PostCard';
import { Megaphone } from 'lucide-react';
import {useNavigate} from 'react-router-dom';

const Feed = () => {
  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


  //fech posts
  const fetchFeeds = async() => {
    setFeeds(dummyPostsData);
  }

  //call when page initalize
  useEffect(() => {
    fetchFeeds();
    setLoading(false);
  }, []);


  return !loading ? (
    <>

    <div className='border h-full overflow-y-scroll no-scrollbar py-10 xl:pr-5 flex items-start md:justify-center xl:gap-8 '>

      {/* stories and posts */}
      <div className=' '>
       <StoryCards/>

        <div className='p-4 mt-4 space-y-4 '>
         {feeds.map((post)=>(
          <PostCard key={post._id} post={post} />
         ))}
        </div>
      </div>

      {/* messages  */}
      <div className='max-xl:hidden sticky top-0'> 
        <div className='max-w-xs bg-white text-xs p-4 group rounded-md flex flex-col gap-2 shadow hover:shadow-xl cursor-pointer relative'>
        <a href="https://goalsetter-arpanvala.netlify.app/" target='_blank'>
              <h3 className='text-slate-600 inline-flex gap-1 items-center font-semibold'>AD <Megaphone size={18} /></h3>
              <div className='overflow-hidden rounded-md'>
                <img src={assets.sponsored_img} alt="ad image" className=' w-full h-full object-cover group-hover:scale-110 transition duration-500' />
              </div>
            
              <p className='text-slate-900'>GoalSetter - Arpan Vala</p>
              <p className='text-slate-600'>Achieve your goals with personalized categories and easy tracking.</p>
          </a>
        </div>

        <div>
        Recent messages
        </div>
      </div>
    </div>
      
    </>
  ) : (
    <Loading />
  )
}

export default Feed
