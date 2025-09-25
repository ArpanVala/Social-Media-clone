import { BadgeCheck, Heart, HeartIcon, MessageCircle, Share, Share2 } from 'lucide-react'
import moment from 'moment'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux';

const PostCard = ({post}) => {
    const postWithHashtags = post.content.replace(/(#\w+)/g, '<span class=" font-medium text-indigo-500">$1</span>');
    const [likes,setLikes] = useState(post.likes_count);
    const currentUser = useSelector((state) => state.user.value);

    const navigate = useNavigate();

    const handleLike = async() => {
        if(likes.includes(currentUser._id)){
            //unlike
            setLikes(likes.filter((id) => id !== currentUser._id));
        } else {
            //like
            setLikes([...likes, currentUser._id]);
        }
    }

  return (
    <div className='shadow bg-white p-4 rounded-lg space-y-3  w-full max-w-2xl'>
        
        {/* user info  */}
        <div className='inline-flex items-center gap-3 cursor-pointer'
        onClick={()=>navigate(`/profile/${post.user._id}`)}
        >
           <img src={post.user.profile_picture} alt="user" className='w-10 h-10 rounded-full shadow' />
           <div>
                <div className='flex items-center gap-1'>
                    <span>{post.user.full_name}</span>
                    <BadgeCheck className='w-4 h-4 text-blue-500'/>
                </div>

                <div className='text-gray-500 text-sm'>
                    {moment(post.createdAt).fromNow()}
                </div>
           </div>
        </div>

        {/* content  */}
        {
            post.content && <div className='text-gray-800 text-sm whitespace-pre-line' dangerouslySetInnerHTML={{__html:postWithHashtags}} />
        }

        {/* Images  */}
        <div className='grid grid-cols-2 gap-2'>
            {post.image_urls.map((img, index) => (
                <img key={index} src={img} alt="post" className={`w-full h-48 object-cover rounded-lg ${post.image_urls.length === 1 && 'col-span-2 h-auto'}`} />
            ))}

        </div>

        {/* action buttons */}
        <div className='flex items-center gap-4 text-gray-600 text-sm pt-2 border-t border-gray-300'>
           <div className='flex items-center gap-1 cursor-pointer' onClick={handleLike}>
                <Heart className={`w-4 h-4  ${likes.includes(currentUser._id) && 'fill-red-500 text-red-500'} `} />
                <span>{likes.length}</span>
           </div>
           <div className='flex items-center gap-1 text-gray-300'>
                <MessageCircle className='w-4 h-4' />
                <span>{10}</span>
           </div>
            <div className='flex items-center gap-1 text-gray-300'>
                <Share2 className='w-4 h-4' />
                <span>{17}</span>
           </div>
        </div>

  
    </div>
  )
}

export default PostCard
