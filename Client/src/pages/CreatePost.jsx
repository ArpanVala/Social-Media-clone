import  { useState } from 'react'
import { Image, X } from 'lucide-react';
import {toast} from 'react-hot-toast';
import Loading from '../components/Loading';
import { useSelector } from 'react-redux';
import { useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios.js';
const CreatePost = () => {

  const user = useSelector((state) => state.user.value);
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const {getToken} = useAuth();
  const navigate = useNavigate();

  const handlePost = async()=> {
    if(!images.length && !content.trim())
    {
      return toast.error("Post can not be empty!");
    }
    if(images.length > 4)
    {
      return toast.error("You can upload maximum 4 images!");
    }
    setLoading(true);
    const postType = images.length && content ? "text_with_image" : images.length ? "image" : "text";

    try {
      
      const formData = new FormData();
      formData.append('content', content); 
      formData.append('post_type', postType);
      images.forEach((img) => formData.append('images', img));

      const {data} = await api.post('/api/post/add', formData, {
        headers: { Authorization: `Bearer ${await getToken()}` }
      });

        if(data.success)
        {
          toast.success(data.message);
        navigate('/');
        }
        else
        {
          console.log(data.message);
          toast.error(data.message);
          throw new Error(data.message);
        }

    } catch (error) {
      console.log(error);
      toast.error(error.message);
      throw new Error(error.message);
      
    }
    setLoading(false);
  }

  return (

    <div className="min-h-screen bg-background">
      <div className='max-w-6xl mx-auto p-6'>
         {/* title  */}
        <div className='mb-8'>
          <h1 className='text-2xl font-semibold text-title '>Create Post </h1>
          <h6 className='text-lg text-subtitle'>Share your thoughts with the world</h6>
        </div>

        {/* form  */}
        <div className='max-w-xl bg-plain p-4 sm:p-8 sm:pb-3 rounded-xl shadow-md space-y-4'>
          {/* header  */}
          <div className='flex items-center gap-3'>
            <img src={user.profile_picture} alt="profile" className='w-12 h-12 rounded-full shadow' />
            <div>
              <p className='font-semibold'>{user.full_name}</p>
              <p className='text-sm text-mute-2'>@{user.username}</p>
            </div>
          </div>

          {/* text area */}
          <textarea className='w-full resize-none min-h-50 mt-4 text-sm outline-none placeholder-mute-2' placeholder="What's on your mind?" value={content} onChange={(e) => setContent(e.target.value)} />

          {/* images  */}
          {
            images.length > 0 && 
            <div className='flex flex-wrap gap-2 mt-4'>
              {

                images.map((img, index)=>(
                  <div className='relative group'  key={index}>

                    <img src={URL.createObjectURL(img)} alt="img" className='h-20 rounded-md'/>
                    <div onClick={()=>setImages(images.filter((_,i)=> i!==index))} className='absolute hidden group-hover:flex justify-center items-center inset-0 bg-bold/40 rounded-md cursor-pointer'>
                    <X className='w-6 h-6 text-plain'/> </div>
                  </div>
                ))
              }
            </div>
          }

          {/* bottom bar  */}
          <div className='flex items-center justify-between pt-3 border-t border-mute-4'>
            <label htmlFor='images' className='cursor-pointer flex items-center gap-2  text-sm text-mute-2 hover:mute-3 transition'>
              <Image className='size-6'/><span className='text-xs text-mute-2 font-semib  old'>*Max 4 photos can be added</span>
            </label>

            <input type="file" id="images" accept="images/*" hidden multiple onChange={(e) => setImages([...images, ...e.target.files])} />

            <button disabled={loading} onClick={()=> toast.promise(handlePost(),{
              loading:"Publishing..."
            })} className='px-4 py-1 rounded-md bg-accent text-plain hover:scale-95 hover:shadow-lg transition duration-200 cursor-pointer'>Publish Post</button>

          </div>

        </div>

      </div>
    </div>
  )
}

export default CreatePost
