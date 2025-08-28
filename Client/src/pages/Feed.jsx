import React, { useEffect, useState } from 'react'
import { dummyPostsData } from '../assets/assets';
import Loading from '../components/Loading';
import StoryCards from '../components/StoryCards';

const Feed = () => {
  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(true);

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

    <div className='h-full overflow-y-scroll no-scrollbar py-10 xl:pr-5 flex flex-col md:flex-row items-start md:justify-center xl:gap-8 '>

      {/* stories and posts */}
      <div className=' '>
       <StoryCards/>
        <div className='p-4 space-y-6 '>
          possts hers
        </div>
      </div>

      {/* messages  */}
      <div className='border'> 
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
