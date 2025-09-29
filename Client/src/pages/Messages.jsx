import { Eye, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Messages = () => {

  const {connections} = useSelector((state) => state.connections);

  const navigate = useNavigate();


  return (
    <div className='min-h-screen relative'>

        <div className='max-w-6xl mx-auto p-6'>
        {/* title  */}
        <div className='mb-8'>
          <h1 className='text-2xl font-semibold text-slate-800 '>Messages</h1>
          <h6 className='text-lg text-slate-600'>Talk to your friends and family.</h6>
        </div>

        {/* connected users  */}
        <div className='flex flex-col gap-3'>
        { connections.map((user)=>(
          <div className='bg-white rounded-md p-6 shadow hover:shadow-md max-w-xl flex flex-wrap gap-5 ' key={user._id}>
            <img src={user.profile_picture} alt="pfp" className='rounded-full size-12' />
            <div className='flex-1'>
              <p className='text-slate-700 font-medium'>{user.full_name}</p>
              <p className='text-slate-500'>@{user.username}</p>
              <p className='text-slate-400 text-sm'>{user.bio}</p>
            </div>

            <div className='flex flex-col gap-2 justify-between'>
              <button className='bg-slate-100 size-12 flex items-center justify-center text-slate-800 p-2 hover:bg-slate-200 rounded active:scale-95 cursor-pointer transition'
              onClick={()=> navigate(`/messages/${user._id}`)}>
                <MessageCircle className='w-5 h-5' />
              </button>
              
              <button className='bg-slate-100 size-12 flex items-center justify-center text-slate-800 p-2 hover:bg-slate-200 rounded active:scale-95 cursor-pointer transition'
              onClick={()=> navigate(`/profile/${user._id}`)}>
                <Eye className='w-5 h-5' />
              </button>

            </div>
          </div>
        ))}

        </div>

        </div>
    </div>
  )
}

export default Messages
