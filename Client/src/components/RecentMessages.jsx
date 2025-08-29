import React, { useEffect } from 'react'
import {  dummyRecentMessagesData } from '../assets/assets';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';

const RecentMessages = () => {
    const [messages, setMessages] = useState([]);

    const getRecentMessages = async()=> {
        setMessages(dummyRecentMessagesData);
    }
    useEffect(()=>{
        getRecentMessages();
    },[])

  return (
    <div className='bg-white rounded-md shadow p-4 mt-4 max-w-xs min-h-20 text-xs text-slate-800 mb-4'>
        <h3 className='font-semibold mb-4 text-slate-600 text-sm'>Recent Messages</h3>

        <div className='flex flex-col max-h-55 overflow-y-scroll no-scrollbar '>
            {
                messages.map((msg, index)=>(
                    <Link to={`/messages/${msg.from_user_id._id}`} key={index}
                    className='flex items-center gap-2 py-3 cursor-pointer'>
                        <img src={msg.from_user_id.profile_picture} alt="pfp" className='w-8  h-8  ring-2 ring-amber-700 ms-1 rounded-full' />

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
