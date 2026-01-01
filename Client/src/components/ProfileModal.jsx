import React from 'react'
import { Pencil } from 'lucide-react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '@clerk/clerk-react';
import { updateUser } from '../features/userSlice.js';

const ProfileModal = ({ setShowEdit }) => {
    const user =  useSelector((state) => state.user.value);
    const {getToken} = useAuth();
    const dispatch = useDispatch();

    const [editInfo, setEditInfo] = React.useState({
      full_name: user.full_name,
      username: user.username,
      bio: user.bio,
      profile_picture: null,
      cover_picture: null,
      location: user.location
    });

    const handleSaveProfile= async(e) => {
        e.preventDefault();
        try{
            const userData = new FormData();
            const {full_name, username, bio, profile_picture, cover_picture, location} = editInfo;
            
            userData.append('username', username);
            userData.append('location', location);
            userData.append('bio', bio);
            userData.append('full_name', full_name);
            profile_picture && userData.append('profile', profile_picture);
            cover_picture && userData.append('cover', cover_picture);

            const token = await getToken();
            dispatch(updateUser({userData, token}))
            
            setShowEdit(false);

        }
        catch(err){
            toast.error(err.message);
        }
    }

  return (
    <div className='fixed inset-0 h-auto overflow-y-scroll bg-bold/50 z-110'>
        <div className='max-w-2xl mx-auto sm:p-6'>
            <div className='bg-plain rounded-lg p-6 shadow'>
                <h1 className='text-2xl font-bold text-title mb-6'>Edit Profile</h1>

                <form className='space-y-4' onSubmit={(e)=>{toast.promise(handleSaveProfile(e),{
                    loading: 'Saving...'
                })}}>

                    {/* profile pic  */}
                    <div className='flex flex-col items-start gap-3'>
                        <label htmlFor="profile_picture" className='block text-sm font-medium mute-3 mb-1'>
                            Profile Picture
                            <input type="file" accept='image/*' id="profile_picture" hidden className='w-full p-3 border border-mute rounded-lg' 
                                onChange={(e) => setEditInfo({...editInfo, profile_picture: e.target.files[0]})}
                            />
                            <div className='group/profile relative'>

                                <img src={editInfo.profile_picture ? URL.createObjectURL(editInfo.profile_picture) : user.profile_picture} alt="" 
                                    className='w-24 h-24 rounded-full object-cover mt-2'
                                />
                                <div className='absolute hidden inset-0 bg-bold/20 rounded-full group-hover/profile:flex items-center justify-center'>
                                        <Pencil className='text-plain w-5 h-5' />
                                </div>
                            </div>
                        </label>
                    </div>

                    {/* cover photo  */}
                    <div className='flex flex-col items-start gap-3'>
                        <label htmlFor="cover_picture" className='block text-sm font-medium mute-3 mb-1'>
                            Cover Photo
                            <input type="file" accept='image/*' id="cover_picture" hidden className='w-full p-3 border border-mute rounded-lg' 
                                onChange={(e) => setEditInfo({...editInfo, cover_picture: e.target.files[0]})}
                            />
                            <div className='group/cover relative'>

                                <img src={editInfo.cover_picture ? URL.createObjectURL(editInfo.cover_picture) : user.cover_picture} alt="" 
                                    className='w-80 h-40 rounded-lg bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 object-cover mt-2'
                                />
                                <div className='absolute hidden inset-0 bg-bold/20 rounded-lg group-hover/cover:flex items-center justify-center'>
                                        <Pencil className='text-plain w-5 h-5' />
                                </div>
                            </div>
                        </label>
                    </div>

                    {/* full_name */}
                    <div>
                        <label className='block text-sm font-medium mute-3 mb-1'>
                           Full Name
                        </label>
                        <input type="text" className='w-full p-3 border border-mute rounded-lg' placeholder='Please enter your name'
                            onChange={e => setEditInfo({...editInfo, full_name: e.target.value})} value={editInfo.full_name}
                        />
                    </div>

                    {/* username */}
                    <div>
                        <label className='block text-sm font-medium mute-3 mb-1'>
                           Username
                        </label>
                        <input type="text" className='w-full p-3 border border-mute rounded-lg' placeholder='Please enter your username'
                            onChange={e => setEditInfo({...editInfo, username: e.target.value})} value={editInfo.username}
                        />
                    </div>

                    {/* bio */}
                    <div>
                        <label className='block text-sm font-medium mute-3 mb-1'>
                           Bio
                        </label>
                        <textarea rows={4} className='w-full p-3 border border-mute resize-none rounded-lg' placeholder='Please enter your bio'
                            onChange={e => setEditInfo({...editInfo, bio: e.target.value})} value={editInfo.bio}
                        />
                    </div>

                    {/* location */}
                    <div>
                        <label className='block text-sm font-medium mute-3 mb-1'>
                           Location
                        </label>
                        <input type="text" className='w-full p-3 border border-mute rounded-lg' placeholder='Please enter your location'
                            onChange={e => setEditInfo({...editInfo, location: e.target.value})} value={editInfo.location}
                        />
                    </div>

                    {/* buttons  */}
                    <div className="flex justify-end space-x-3 pt-6">
                        <button type="button" 
                        onClick={()=>setShowEdit(false)}
                        className="border border-mute-4 mute-3 px-4 py-2 rounded-lg hover:bg-background transition-colors cursor-pointer">
                            Cancel
                        </button>
                        <button type="submit" className="bg-gradient-to-r from-accent to-gradient-end-hover  text-plain px-4 py-2 rounded-lg  hover:from-gradient-start-hover hover:to-gradient-end-hover cursor-pointer">
                            Save Changes
                        </button>
                    </div>

                    


                </form>

            </div>
        </div>
      
    </div>
  )
}

export default ProfileModal
