import { useAuth } from '@clerk/clerk-react';
import { MapPin, MessageCircle, Plus, UserPlus } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios.js';
import { fetchUser } from '../features/userSlice';
import toast from 'react-hot-toast';

const UserCard = ({user}) => {

    const currentUser =  useSelector((state) => state.user.value);
    const {getToken} = useAuth();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleFollow = async() => {
        try {
            const {data} = await api.post('/api/user/follow', {id:user._id},{
                headers: { Authorization: `Bearer ${await getToken()}` }
            })
            if(data.success)
            {
                toast.success(data.message);
                dispatch(fetchUser(await getToken()));
            }
            else{
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

    const handleConnectionRequest = async() => {
        if(currentUser.connections.includes(user._id))
        {
            return navigate('/messages/'+ user._id);
        }
         try {
            const {data} = await api.post('/api/user/connect', {id:user._id},{
                headers: { Authorization: `Bearer ${await getToken()}` }
            })
            if(data.success)
            {
                toast.success(data.message);
            }
            else{
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

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
