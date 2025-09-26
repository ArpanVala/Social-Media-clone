import { useAuth } from "@clerk/clerk-react";
import { ArrowLeft, Sparkle, Text, Upload } from "lucide-react";
import { useState } from "react"
import toast from "react-hot-toast";
import api from "../api/axios.js";

const StoryModal = ({setShowModal, fetchStories}) => {
    const bgColors = [ "#4f46e5", "#7c3aed", "#db2777", "#e11d48", "#ca8a04","#0d9488"]
    const [mode, setMode] = useState("text");
    const [background, setBackground] = useState(bgColors[0]);
    const [text, setText] = useState("");
    const [media, setMedia] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const {getToken} = useAuth();
  
    const MAX_VIDEO_DURATION= 60;
    const MAX_VIDEO_SIZE = 50; // in MB

    // Handle media upload 
    const handleMediaUpload = (e) => {
      const file = e.target.files?.[0];
      if(file)
      {
        if(file.type.startsWith('video'))
        {
          if(file.size > MAX_VIDEO_SIZE * 1024 * 1024)
          {
            toast.error("Video size should be less than "+ MAX_VIDEO_SIZE + "MB");
            setMedia(null); 
            setPreviewUrl(null);
            return;
          }
          const video = document.createElement('video');
          video.preload = 'metadata';
          video.onloadedmetadata = () => {

            window.URL.revokeObjectURL(video.src);
            if(video.duration > MAX_VIDEO_DURATION)
            {
              toast.error("Video duration can't exceed "+ MAX_VIDEO_DURATION + " seconds");
              setMedia(null); 
              setPreviewUrl(null);
              return;
            }
            else{
              setMedia(file);
              setPreviewUrl(URL.createObjectURL(file));
              setText('');
              setMode('media');
            }
          }
          video.src = URL.createObjectURL(file);
        }
        else if(file.type.startsWith('image'))
        {
          setMedia(file);
              setPreviewUrl(URL.createObjectURL(file));
              setText('');
              setMode('media');

        }
      }
    }

    //handle 'create story' event
    const handleCreateStory = async () => {

      const media_type = mode === 'media' ? media?.type.startsWith('image') ? 'image' : 'video' : 'text';

      if (media_type == 'text' && !text.trim()) {
        toast.error("Please enter some text for your story.");
       return;
      }
      let formData = new FormData();
      formData.append('content', text);
      formData.append('media_type', media_type);
      formData.append('media', media);
      formData.append('background_color', background);
      
      const token = await getToken();
      try {
        const {data} = await api.post('/api/story/create', formData, {
          headers: {Authorization : `Bearer ${token}`}
        });

        if(data.success)
        {
          toast.success("Story created successfully!");
          setShowModal(false);
          fetchStories();
        }
        else{
          toast.error(data.message);
        }
      } catch (error) {
        toast.error("An error occurred while creating the story : "+ error.message);
      }

  }

  return (
    <div className="fixed inset-0 z-110 min-h-screen bg-black/50 backdrop-blur text-white flex justify-center items-center p-4">
      <div className="w-full max-w-md ">
        <div className="text-center mb-4 flex items-center justify-between">
            <button onClick={()=> setShowModal(false)}
            className="p-2 cursor-pointer hover:bg-gray-100/30 rounded-full"
            ><ArrowLeft/></button>

            <h1 className="text-lg font-semibold">Create Story</h1>
            {/* span for adding h1 in center and  for space at right end */}
            <span className="w-10"></span>
        </div>

        <div className="h-96 rounded-xl flex items-center justify-center relative" style={{backgroundColor:background}}>
        {
          // Text mode
          mode === "text" && (
            <textarea className="w-full h-full p-6 text-white bg-transparent text-lg resize-none focus:outline-none" onChange={(e) => setText(e.target.value)} value={text} placeholder="What's on your mind?"/>
          )
        }
        {
          // Media mode
          mode === "media" && previewUrl && (
           media?.type.startsWith('image') ?
           (
            <img src={previewUrl} className="object-contain max-h-full" />
           )
           :
           (
            <video src={previewUrl} className="object-contain max-h-full" />
           )
          )
        }
        </div>

        {/* choosing color */}
        <div className="flex mt-3 gap-3">
          {bgColors.map((color) => (
            <button style={{backgroundColor: color}} 
              className="w-8 h-4 rounded-full ring-2 cursor-pointer"
              onClick={() => setBackground(color)}
            />
          ))}
        </div>

        {/* text and media mode buttons */}
        <div className="flex gap-2 mt-3">
          <button onClick={() => {setMode("text"); setMedia(null); setPreviewUrl(null);}} 
          className={`flex-1 flex items-center justify-center text-sm gap-2 p-2 rounded cursor-pointer ${mode === "text" ? "bg-white text-black" : "bg-zinc-800"}`}>
            <Text size={18}/>Text
          </button>

          <label className={`flex-1 flex items-center justify-center text-sm gap-2 p-2 rounded cursor-pointer ${mode === "media" ? "bg-white text-black" : "bg-zinc-800"}`}>
            <input type="file" accept="image/*, video/*" className="hidden" onChange={handleMediaUpload}/>
            <Upload size={18}/>Image/Video
          </label>
        </div>

        {/* create button  */}
        <div className="mt-4">
          <button
          onClick={()=> toast.promise(handleCreateStory(), {
            loading: 'Saving...',
          })}
           className="flex items-center justify-center gap-2 p-2 rounded-lg cursor-pointer w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 active:scale-95 transition">
            <Sparkle size={18}/> Create Story
          </button>
        </div>

      </div>
   
      
    </div>
  )
}

export default StoryModal;
