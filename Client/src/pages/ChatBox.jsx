import { useEffect, useRef, useState } from 'react'
import { ImageIcon, SendHorizonal, ArrowDown, Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { addMessage, fetchMessages, resetMessages } from '../features/messageSlice.js';
import toast from 'react-hot-toast';
import api from '../api/axios.js';

const ChatBox = () => {
  const { messages } = useSelector((state) => state.messages);
  const { userId } = useParams();

  const { getToken } = useAuth();
  const dispatch = useDispatch();

  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [user, setUser] = useState(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const messagesRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const connections = useSelector((state) => state.connections.connections);


  const fetchUserMessages = async () => {
    try {
      const token = await getToken();
      dispatch(fetchMessages({ token, userId }));
    } catch (error) {
      toast.error(error.message);

    }
  }

  const sendMessage = async () => {
    try {
      if (!text && !image) return;
      if (isSending) return; // Prevent multiple sends

      setIsSending(true);
      const token = await getToken();

      const formData = new FormData();
      formData.append('to_user_id', userId);
      formData.append('text', text);
      image && formData.append('image', image);

      const { data } = await api.post('/api/message/send', formData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (data.success) {
        setText('');
        setImage(null);
        dispatch(addMessage(data.message));
      }
      else {
        console.log(data);
        throw new Error(data.message);
      }

    } catch (error) {
      toast.error(error.message);
      console.log(error);
    } finally {
      setIsSending(false);
    }
  }

  const scrollToBottom = () => {
    messagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!isAtBottom);
    }
  }

  useEffect(() => {
    fetchUserMessages();
    return () => {
      dispatch(resetMessages());
    }
  }, [userId])


  useEffect(() => {
    if (connections.length > 0) {
      const user = connections.find(connection => connection._id === userId);
      setUser(user);
    }
  }, [connections, userId])

  useEffect(() => {
    setTimeout(() => {
      messagesRef.current?.scrollIntoView({ behavior: "smooth" })
    }, 500);
  }, [messages])


  return user && (
    <div className='flex flex-col h-screen '>
      <div className='flex items-center gap-2 p-4 md:px-10  xl:pl-42 bg-mute/10  border-b border-mute'>
        <img src={user.profile_picture} alt="" className='size-8 rounded-full ' />
        <div>
          <p className='font-medium text-mute-3'>{user.full_name}</p>
          <p className='text-sm text-mute-2 -mt-1.5'>@{user.username}</p>
        </div>
      </div>

      <div ref={messagesContainerRef} onScroll={handleScroll} className='p-5 md:px-10 h-full overflow-y-scroll relative scrollbar'>
        <div className='space-y-2 max-w-4xl mx-auto '>
          {
            messages.toSorted((a, b) => new Date(a.createdAt) - new Date(b.createdAt)).map((message, index) => (
              <div key={index} className={`flex flex-col ${message.to_user_id !== user._id ? 'items-start' : 'items-end'}`}>
                <div className={`p-2 text-sm max-w-sm bg-plain text-text-secondary rounded-xl break-words shadow ${message.to_user_id !== user._id ? 'rounded-bl-none' : 'rounded-br-none'}`}>
                  {
                    message.message_type === 'image' &&
                    <img src={message.media_url} alt="Message media" className='max-w-sm w-full mb-1 rounded-xl' />
                  }
                  <p>{message.text}</p>
                </div>
              </div>
            ))
          }
          <div ref={messagesRef} />
        </div>

        {/* Scroll to bottom button */}
        {showScrollButton && (
          <button
            onClick={scrollToBottom}
            className='fixed bottom-20 right-8 bg-plain text-bold hover:bg-background mute-3 p-2 md:p-3 rounded-full shadow-lg border border-mute transition-all duration-200 z-10'
          >
            <ArrowDown size={15} />
          </button>
        )}
      </div>

      <div className='px-4'>
        <div className='flex items-center gap-3 pl-5 p-1.5 bg-plain w-full max-w-xl mx-auto  border border-mute shadow rounded-full mb-5'>

          <input
            type="text"
            placeholder='Type a message...'
            className='flex-1 outline-none text-text-secondary'
            onKeyDown={e => e.key === 'Enter' && !isSending && sendMessage()}
            onChange={(e) => setText(e.target.value)}
            value={text}
            disabled={isSending}
          />

          <label htmlFor="image" className={isSending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}>
            {
              image ? (
                <div className='relative'>
                  <img src={URL.createObjectURL(image)} alt="preview" className='h-8 rounded' />
                  {isSending && (
                    <div className='absolute inset-0 bg-bold bg-opacity-50 rounded flex items-center justify-center'>
                      <Loader2 className='size-4 text-plain animate-spin' />
                    </div>
                  )}
                </div>
              ) : (
                <ImageIcon className='size-7 text-mute-2' />
              )
            }
            <input
              type="file"
              id="image"
              accept="image/*"
              hidden
              onChange={(e) => setImage(e.target.files[0])}
              disabled={isSending}
            />
          </label>
          <button
            onClick={sendMessage}
            disabled={isSending}
            className={`bg-gradient-to-br from-accent to-gradient-end-hover hover:from-accent hover:to-gradient-end-hover
              active:scale-95 text-plain p-2 rounded-full transition-all duration-200 ${isSending ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'
              }`}
          >
            {isSending ? (
              <Loader2 size={18} className='animate-spin' />
            ) : (
              <SendHorizonal size={18} />
            )}
          </button>
        </div>

      </div>
    </div>
  )
}

export default ChatBox
