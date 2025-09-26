import { Plus } from "lucide-react"
import { useEffect, useState } from "react";
import moment from 'moment';
import StoryModal from "./StoryModal";
import StoryViewer from "./StoryViewer";
import { useAuth } from "@clerk/clerk-react";
import api from "../api/axios.js";
import toast from "react-hot-toast";

const StoryCards = () => {

    const [stories, setStories] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [viewStory, setViewStory] = useState(null);

    const {getToken} = useAuth();

    const fetchStories = async() => {
       
        try {
             const token = await getToken();
            const {data} = await api.get('/api/story/get', {
            headers: {Authorization : `Bearer ${token}`}
        })
        if(data.success)
        {

            setStories(data.stories);
        }
        else{
            console.log(data.message);
            toast.error(data.message);
        }
            
        } catch (error) {
            toast.error("An error occurred while fetching stories: " + error.message);
            
        }
       
    }

    useEffect(() =>{
        fetchStories();
    },[ ])

  return (
    <>
    <div className="w-screen sm:w-[calc(100vw - 240px)] lg:max-w-2xl no-scrollbar overflow-x-auto px-4">

        <section className="flex gap-4">

         {/* add story card  */}
         <div onClick={() => setShowModal(true)} className="rounded-lg shadow-sm min-w-30 max-w-30 max-h-40 aspect-[3/4] cursor-pointer hover:shadow-lg transition-all duration-200 border-2 border-dashed border-indigo-300 bg-gradient-to-b from-indigo-50 to-white">
            <div className="h-full flex flex-col gap-4 justify-center items-center p-4">
                <div className="bg-indigo-100 p-2 rounded-full">
                    <Plus className="text-indigo-500" />
                </div>
               <span className="text-sm font-medium text-indigo-500">Add Story</span>
            </div>
         </div>

         {/* Story cards  */}

         {
            stories.map((story, index) => (
                <div key={index}
                onClick={() => setViewStory(story)}
                className={`relative rounded-lg shadow min-w-30 max-w-30 max-h-40 cursor-pointer hover:shadow-lg transition-all duration-200 bg-gradient-to-b from-indigo-500 to-purple-600 hover:from-indigo-700 hover:to-purple-800 active: scale-95`}
                >
                    <img src={story.user.profile_picture} 
                    className="absolute top-3 left-3 size-8 z-10 rounded-full ring ring-gray-100 shadow" />

                    <p className="absolute top-18 left-3 text-white/60 text-sm truncate max-w-24 z-10">
                    {story.content}
                    </p>

                    <p className="absolute bottom-2 right-2  text-white/85 text-xs z-10">
                    {moment(story.createdAt).fromNow()}
                    </p>
                    {
                        story.media_type !== 'text' && (
                            <div className="absolute inset-0 z-1 rounded-lg bg-black overflow-hidden">
                            {
                                story.media_type === "image" ? 
                                <img src={story.media_url}
                                className="w-full h-full object-cover hover:scale-110 transition duration-500 opacity-70 hover:opacity-100"/>
                                :
                                <video
                                src={story.media_url}
                                className="w-full h-full object-cover hover:scale-110 transition duration-500 opacity-70 hover:opacity-100"
                                />
                            }
                            </div>
                        )
                    }

                </div>
            ))
         }
        </section>

        {/* add story modal  */}
        { showModal && <StoryModal setShowModal={setShowModal} fetchStories={fetchStories} />}

        {/* add story viewer  */}
        {viewStory && <StoryViewer viewStory={viewStory} setViewStory={setViewStory} />}

    </div>
    </>
  )
}

export default StoryCards
