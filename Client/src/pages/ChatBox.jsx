import  { useEffect, useRef, useState } from 'react'
import { dummyMessagesData, dummyUserData } from '../assets/assets'
import { ImageIcon, SendHorizonal } from 'lucide-react';

const ChatBox = () => {
  const messages = dummyMessagesData;
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [user, setUser] = useState(dummyUserData);

  const messagesRef = useRef(null);

  useEffect(() => {
    messagesRef.current?.scrollIntoView({behavior: "smooth"})
  },[messages])

  const sendMessage = async() => { setText(''); setImage(null); }

  return  user && (
    <div className='flex flex-col h-screen'>
        <div className='flex items-center gap-2 p-4 md:px-10  xl:pl-42  bg-gradient-to-r from-gray to-purple-50  border-b border-gray-300'>
            <img src={user.profile_picture} alt="" className='size-8 rounded-full ' />
            <div>
              <p className='font-medium'>{user.full_name}</p>
              <p className='text-sm text-gray-500 -mt-1.5'>@{user.username}</p>
            </div>
        </div>

        <div className='p-5 md:px-10 h-full overflow-y-scroll'>
          <div className='space-y-2 max-w-4xl mx-auto '>
            {
              messages.toSorted((a,b) => new Date(a.createdAt) - new Date(b.createdAt)).map((message, index) => (
                <div key={index} className={`flex flex-col ${message.to_user_id !== user._id ? 'items-start' : 'items-end'}`}>
                  <div className={`p-2 text-sm max-w-sm bg-white text-slate-700 rounded-xl shadow ${message.to_user_id !== user._id ? 'rounded-bl-none': 'rounded-br-none'}`}>
                  {
                    message.message_type === 'image' &&
                    <img src={message.media_url} alt="Message media" className='max-w-sm w-full mb-1 rounded-xl' />
                  }
                  <p>{message.text}</p>
                  </div>
                </div>
              ))
            }

            <div ref={messagesRef}/>
          </div>
        </div>

        <div className='px-4'>
            <div className='flex items-center gap-3 pl-5 p-1.5 bg-white w-full max-w-xl mx-auto  border border-gray-200 shadow rounded-full mb-5'>

            <input type="text" placeholder='Type a message...' className='flex-1 outline-none text-slate-700'
              onKeyDown={e => e.key === 'Enter' && sendMessage()} onChange={(e) => setText(e.target.value)} value={text} />
            
            <label htmlFor="image">
                  {
                    image ? <img src={URL.createObjectURL(image)} alt="preview" className='h-8 rounded' /> : <ImageIcon className='size-7 text-gray-400 cursor-pointer' />
                  }
              

                <input type="file" id="image" accept="image/*" hidden onChange={(e) => setImage(e.target.files[0])} />
             </label>
            <button onClick={sendMessage} className='bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-700 hover:to-purple-800
            active:scale-95 cursor-pointer text-white p-2 rounded-full' >
            <SendHorizonal size={18}/>
            </button>
            </div>

        </div>
    </div>
  )
}

export default ChatBox
