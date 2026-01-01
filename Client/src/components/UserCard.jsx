import { useAuth } from '@clerk/clerk-react';
import { MapPin, MessageCircle, Plus, UserPlus } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios.js';
import { fetchUser } from '../features/userSlice';
import toast from 'react-hot-toast';

const UserCard = ({user, onClick}) => {

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
    <div className='bg-plain p-4 pt-6 rounded-md shadow-md flex flex-col justify-between w-72 hover:shadow-xl group cursor-pointer' onClick={onClick}>
        {/* user details  */}
        <div className='text-center'>

            <img src={user.profile_picture} alt="profile pic" className='rounded-full object-cover w-16 h-16 shadow-md mx-auto ' />
            <p className='mt-2 font-semibold  text-subtitle'>{user.full_name}</p>
            <p className='text-sm text-subtitle'>@{user.username}</p>
            <p className='text-sm text-mute-2/70 mt-2 text-center'>{user.bio}</p>
        </div>

        <div className='flex mt-4 gap-2 justify-between '>
        {
            user.location && 
            <div className='flex items-center gap-1 text-mute-2/70'> 
                <MapPin size={14}/>
                <span className='text-sm'> {user.location}</span>
            </div>

        }
        {
            user.followers && 
            <div className='flex items-center gap-1 text-mute-2/70'> 
                <span className='text-sm'> {user.followers.length} followers</span>
            </div>

        }
        </div>

        {/* follow button  */}
        {currentUser?._id !== user._id && (
        <div className='flex  mt-4 gap-2'>

            <button onClick={handleFollow}
            disabled={currentUser.following.includes(user._id)}
            className='w-full py-2 rounded-md  bg-mute-2/10 text-bold flex justify-center items-center gap-2 cursor-pointer'
            >
                <UserPlus size={14}/>
                {currentUser?.following.includes(user._id) ? 'Following' : 'Follow'}
            </button>

            <button 
            onClick={handleConnectionRequest}
            className=' px-3  rounded-md  bg-accent hover:bg-gradient-start-hover hover:scale-95 text-plain'>
                {currentUser?.connections.includes(user._id) ? 
                <MessageCircle size={18}/>
                 : <Plus size={14}/>}
            </button>

        </div>
        )}
    </div>
  )
}

export default UserCard
