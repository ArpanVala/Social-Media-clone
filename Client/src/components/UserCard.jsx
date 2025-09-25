import { MapPin, MessageCircle, Plus, UserPlus } from 'lucide-react';
import { useSelector } from 'react-redux';

const UserCard = ({user}) => {

    const currentUser =  useSelector((state) => state.user.value);

    const handleFollow = async() => {}

    const handleConnectionRequest = async() => {}

  return (
    <div className='bg-white p-4 pt-6 rounded-md shadow-md flex flex-col justify-between w-72'>
        {/* user details  */}
        <div className='text-center'>

            <img src={user.profile_picture} alt="profile pic" className='rounded-full w-16 shadow-md mx-auto ' />
            <p className='mt-2 font-semibold  text-slate-700'>{user.full_name}</p>
            <p className='text-sm text-slate-500'>@{user.username}</p>
            <p className='text-sm text-slate-400 mt-2 text-center'>{user.bio}</p>
        </div>

        <div className='flex mt-4 gap-2 justify-between '>
        {
            user.location && 
            <div className='flex items-center gap-1 text-slate-400'> 
                <MapPin size={14}/>
                <span className='text-sm'> {user.location}</span>
            </div>

        }
        {
            user.followers && 
            <div className='flex items-center gap-1 text-slate-400'> 
                <span className='text-sm'> {user.followers.length} followers</span>
            </div>

        }
        </div>

        {/* follow button  */}
        <div className='flex  mt-4 gap-2'>

            <button onClick={handleFollow}
            disabled={currentUser.following.includes(user._id)}
            className='w-full py-2 rounded-md  bg-slate-200 text-black flex justify-center items-center gap-2 cursor-pointer'
            >
                <UserPlus size={14}/>
                {currentUser?.following.includes(user._id) ? 'Following' : 'Follow'}
            </button>

            <button 
            onClick={handleConnectionRequest}
            className=' px-3  rounded-md  bg-indigo-500 hover:bg-indigo-600 hover:scale-95 text-white'>
                {currentUser?.connections.includes(user._id) ? 
                <MessageCircle size={18}/>
                 : <Plus size={14}/>}
            </button>

        </div>
    </div>
  )
}

export default UserCard
