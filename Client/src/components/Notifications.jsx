import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Notifications = ({t, message}) => {
    
    const navigate = useNavigate();
  return (
    <>
    <div className={'max-w-md w-full bg-plain shadow-lg rounded-lg flex border border-mute-4 hover:scale-105 transition'}>
        <div className='flex-1 p-4'>
            <div className="flex items-center">
                <img src={message.from_user_id.profile_picture} alt="pfp" className='h-10 w-10 rounded-full flex-shrink-0 mt-0.5'/>
                <div className='ml-3 flex-1'>
                    <p className='text-sm font-medium text-mute-3'> {message.from_user_id.full_name}</p>
                    <p className='text-sm text-mute-2'>{message.text.slice(0, 50)}</p>

                </div>

            </div>
        </div>

        <div className='border-t border-mute flex'>
            <button onClick={()=> {
                navigate(`/messages/${message.from_user_id._id}`)
                toast.dismiss(t.id);}} 
                className='p-4 text-gradient-start-hover font-semibold'>Reply</button>
        </div>


    </div>
    
    </>
   
  )
}

export default Notifications