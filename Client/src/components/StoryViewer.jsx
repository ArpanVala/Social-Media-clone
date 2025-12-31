import { X } from 'lucide-react';
import React, { useEffect, useState } from 'react'

const StoryViewer = ({ viewStory, setViewStory }) => {
    const [progress, setProgress] = useState(0);

    // for progress bar 
    useEffect(() => {
       let timer, progressInterval;
       if(viewStory && viewStory.media_type != 'video'){
        setProgress(0);
        
        const duration = 10000; //10 secs
        const setTime = 100; //interval
        let elapsed = 0;
        //for progress bar
        progressInterval = setInterval(()=> {
            elapsed += setTime;
            setProgress((elapsed / duration) * 100);
        }, setTime);

        //clsoe after 10 sec
        timer = setTimeout(() => {
            setViewStory(null);
        }, duration)
       }

       return () => {
           clearInterval(progressInterval);
           clearTimeout(timer);
       };
    }, [viewStory,setViewStory]);

    const handleClose = () => {
        setViewStory(null);
    }

    const renderContent = () => {
       switch (viewStory.media_type) {
        case 'text':
            return (
                <div
                    className='p-8 text-white text-xl md:text-2xl text-center w-full h-full flex items-center justify-center whitespace-pre-wrap break-all'
                    style={{ overflowWrap: 'anywhere' }}
                >
                    {viewStory.content}
                </div>
            );

        case 'image':
            return (
                <img src={viewStory.media_url} alt="" className='max-h-screen max-w-full object-contain' />
            );
        case 'video':
            return (
                <video onEnded={()=> setViewStory(null)} src={viewStory.media_url} className='max-h-screen' autoPlay />
            );

        default:
            return null;
       }
    }

  return (
    <div className='fixed inset-0 bg-black/70 h-screen z-110 flex items-center justify-center' 
    style={{ backgroundColor: viewStory.media_type === 'text' ? viewStory.background_color : 'black' }}
    >

    {/* progress bar  */}
    <div className=' absolute top-0 left-0 w-full h-1 bg-gray-500 '>
        <div className='h-full bg-white  transition-all linear duration-100' style={{width: `${progress}%`}}>

        </div>
    </div>    

    {/* User info */}
    <div className='absolute top-4 left-4 flex items-center gap-3 p-2 sm:px-4 sm:py-3  backdrop-blur-2xl bg-black/50 rounded'>
        <img src={viewStory.user?.profile_picture} alt="" className='size-9 sm:size-10  rounded-full object-cover border border-white' />
        <div className='text-white font-medium'>
            <span>{viewStory.user?.full_name}</span>
        </div>
    </div>

    {/* close btn  */}
    <button onClick={()=> handleClose()}
    className='absolute top-4 right-4 text-white text-3xl font-bold focus:outline-none'>
        <X className='w-8 h-8 hover:scale-110 transition cursor-pointer'/>
    </button>


    {/* display content  */}

    <div className='flex items-center justify-center max-h-[90vh] max-w-[90vw]'>
        {renderContent()}
    </div>
    </div>

   
  )
}

export default StoryViewer
