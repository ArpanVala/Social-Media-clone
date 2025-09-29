import { Link, useParams } from "react-router-dom";
import { dummyPostsData, dummyUserData } from "../assets/assets";
import { useEffect, useState } from "react";

import Loading from "../components/Loading"
import UserProfileinfo from "../components/UserProfileinfo";
import PostCard from "../components/PostCard";
import moment from "moment";
import ProfileModal from "../components/ProfileModal";

import { useAuth } from '@clerk/clerk-react'
import api from "../api/axios.js";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const Profile = () => {
  //if profileid is not found then means its personal profile
  const {profileId} = useParams();
  const currentUser = useSelector((state) => state.user.value);
  const {getToken} = useAuth();

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  // for switching between tabs 
  const [currentTab, setCurrentTab] = useState("posts");
  //for displaying edit button on personal profile 
  const [showEdit, setShowEdit] = useState(false);


  const fetchUser = async(pId)=> {
    const token = await getToken();
    try {
      const {data} = await api.post('/api/user/profile', {paramId: pId}, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if(data.success)
      {
        setUser(data.user);
        setPosts(data.posts);
      }
      else
      {
        toast.error(data.message);
      }
      
    } catch (error) {
      toast.error(error.message);
      
    }
  }

  useEffect(()=>{
    if(profileId)
    {
       fetchUser(profileId);
    }
    else
    {
      fetchUser(currentUser._id);
    }
   
  },[profileId, currentUser])


  return user ? (
    <div className="relative overflow-y-scroll h-full p-6 ">
      <div className="max-w-3xl mx-auto">
     
        <div className="bg-white rounded-3xl shadow overflow-hidden">
        {/* profile cover photo  */}
            <div className="h-40 md:h-56 bg-gradient-to-r from-indigo-200  via-purple-200 to-pink-200">
              {user.cover_picture && <img src={user.cover_picture} alt="Profile Cover" className="w-full h-full object-cover" />}
            </div>
            
            {/* profile info   */}
          <UserProfileinfo posts={posts} user={user} profileId={profileId} setShowEdit={setShowEdit} />
        </div>

        {/* tabs  */}
        <div className="mt-6 rounded-md bg-white shadow p-1 mx-auto max-w-md">
          <div className="flex gap-1">
          {
            ["posts", "media", "likes"].map((tab, index)=>(
              <button key={index} onClick={()=> setCurrentTab(tab)}
              className={`rounded-md text-sm transition-colors cursor-pointer flex-1 py-2 px-4 ${currentTab === tab ? "bg-indigo-500 text-white" : " text-gray-600 hover:bg-gray-200"}`} >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}

              </button>
            ))
          }
          </div>
        </div>

        {/* posts  */}
          {
            currentTab === "posts" && 
            (
                <div className="mt-6  flex flex-col items-center gap-6">
                {posts.map((post)=> ( <PostCard key={post._id} post={post}/>))}
                </div>)
          }

          {/* Media  */}
          {
            currentTab === 'media' && (
              <div className="flex flex-wrap max-w-6xl mt-6">
              {
                posts.filter((post) => post.image_urls.length > 0).map((post)=>(
                  <>
                    {
                      post.image_urls.map((img, index)=>(
                        <Link key={index} target="_blank" to={img} className="relative group">
                          <img src={img} alt="post" className="w-64 aspect-video object-cover"/>
                          <p className="absolute bottom-1 right-1 text-xs p-1 px-3 backdrop-blur-xl transition duration-300 text-white opacity-0 group-hover:opacity-100">Posted {moment(post.createdAt).fromNow()}</p>
                        </Link>
                      ))
                    }
                  </>
                ))
              }
              </div>
            )
          }

      </div>
      
          {/* Edit card  */}
          {
            showEdit && <ProfileModal setShowEdit={setShowEdit} />
          }
    </div>
  ):
  (
    <Loading/>
  )
}

export default Profile
