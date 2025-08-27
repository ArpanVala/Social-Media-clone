import { ArrowLeft, Sparkle, Text, Upload } from "lucide-react";
import { useState } from "react"
import toast from "react-hot-toast";

const StoryModal = ({setShowModal, fetchStories}) => {
    const bgColors = [ "#4f46e5", "#7c3aed", "#db2777", "#e11d48", "#ca8a04","#0d9488"]
    const [mode, setMode] = useState("text");
    const [background, setBackground] = useState(bgColors[0]);
    const [text, setText] = useState("");
    const [media, setMedia] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    // Handle media upload 
    const handleMediaUpload = (e) => {
      const file = e.target.files?.[0];
      if(file)
      {
        setMedia(file);
        setPreviewUrl(URL.createObjectURL(file));
      }
    }

    //handle 'create story' event
    const handleCreateStory = async () => {
       
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
            <input type="file" accept="image/*, video/*" className="hidden" onChange={(e) => {handleMediaUpload(e); setMode("media")}}/>
            <Upload size={18}/>Image/Video
          </label>
        </div>

        {/* create button  */}
        <div className="mt-4">
          <button
          onClick={()=> toast.promise(handleCreateStory(), {
            loading: 'Saving...',
            success: 'Story created successfully!',
            error: (e) => <p>{e.message}</p>
          })}
           className="flex items-center justify-center gap-2 p-2 rounded-lg cursor-pointer w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 active:scale-95 transition">
            <Sparkle size={18}/> Create Story
          </button>
        </div>

      </div>
   
      
    </div>
  )
}

export default StoryModal
