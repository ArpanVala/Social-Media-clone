import  { useEffect } from 'react'
import { useState } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { useAuth, useUser } from '@clerk/clerk-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const RecentMessages = () => {
    const [messages, setMessages] = useState([]);
    const {user} = useUser();
    const {getToken} = useAuth();

    const getRecentMessages = async()=> {
        try {
            const token = await getToken();
            const {data} = await api.get('/api/user/recent-messages', {
                headers:{ Authorization: `Bearer ${token}`  }
            })

            if(data.success)
            {
                const groupMessages =data.messages.reduce((acc, message)=>{
                    const senderId = message.from_user_id._id;
                    if(!acc[senderId] || new Date(message.createdAt) > new Date(acc[senderId].createdAt))
                    {
                        acc[senderId] = message;
                    }
                    return acc;
                 },{})

                 //sort messages by date
                 const sortedMessages = Object.values(groupMessages).sort((a, b)=> new Date(b.createdAt) - new Date(a.createdAt) )
                 setMessages(sortedMessages);
            }
            else
            {
                console.log(data.messages);
                toast.error(data.messages);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
       
    }
    useEffect(()=>{
        if(user)
        {

            getRecentMessages();
            setInterval(getRecentMessages, 30000); //fetch recent messages every 30 seconds
            return ()=> {clearInterval()}

        }
        
    },[user])

  return (
    <div className='bg-white rounded-md shadow p-4 mt-4 max-w-xs min-h-20 text-xs text-slate-800 mb-4'>
        <h3 className='font-semibold mb-4 text-slate-600 text-sm'>Recent Messages</h3>

        <div className='flex flex-col max-h-55 overflow-y-scroll no-scrollbar '>
            {
                messages.map((msg, index)=>(
                    <Link to={`/messages/${msg.from_user_id._id}`} key={index}
                    className='flex items-center gap-2 py-3 cursor-pointer'>
                        <img src={msg.from_user_id.profile_picture} alt="pfp" className='w-10 h-10 flex-shrink-0 rounded-full object-cover shadow' />

                        <div className='w-full '>
                            <div className='flex justify-between'>
                                <p className='font-medium'>
                                    {msg.from_user_id.full_name}
                                </p>
                                <p className='text-xs text-gray-500'>
                                    {moment(msg.createdAt).fromNow()}
                                </p>
                            </div>
                            <div className='flex justify-between'>
                                <p className='text-gray-500'>
                                    {msg.text? msg.text : 'Media'}
                                </p>
                                {!msg.seen && <p className='bg-indigo-500 text-xs text-white w-4 h-4  flex items-center justify-center rounded-full'>1</p>}


                            </div>

                        </div>
                    </Link>
                ))
            }

        </div>

        
     
    </div>
  )
}

export default RecentMessages
