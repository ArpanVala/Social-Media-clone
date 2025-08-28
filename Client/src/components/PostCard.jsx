import { BadgeCheck } from 'lucide-react'
import moment from 'moment'
import React from 'react'

const PostCard = ({post}) => {
    const postWithHashtags = post.content.replace(/(#\w+)/g, '<span class=" font-medium text-indigo-500">$1</span>');
  return (
    <div className='shadow bg-white p-4 rounded-lg space-y-3  w-full max-w-2xl'>
        
        {/* user info  */}
        <div className='inline-flex items-center gap-3 cursor-pointer'>
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
  
    </div>
  )
}

export default PostCard
