import { BadgeCheck, Heart, HeartIcon, MessageCircle, Share, Share2, Bookmark } from 'lucide-react'
import moment from 'moment'
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { useAuth } from '@clerk/clerk-react';
import api from '../api/axios.js';
import toast from 'react-hot-toast';

const PostCard = ({ post }) => {
    const postWithHashtags = post.content ? post.content.replace(/(#\w+)/g, '<span class=" font-medium text-accent">$1</span>') : '';
    const [likes, setLikes] = useState(post.likes_count);
    const [isSaved, setIsSaved] = useState(false);
    const currentUser = useSelector((state) => state.user.value);

    const navigate = useNavigate();


    const { getToken } = useAuth();

    // Check if post is saved on mount
    useEffect(() => {
        const checkSaved = async () => {
            try {
                const token = await getToken();
                const { data } = await api.get(`/api/save/check/${post._id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (data.success) {
                    setIsSaved(data.saved);
                }
            } catch (error) {
                console.error(error);
            }
        };
        checkSaved();
    }, [post._id, getToken]);

    const handleLike = async () => {
        try {
            const { data } = await api.post('/api/post/like', { postId: post._id }, {
                headers: { Authorization: `Bearer ${await getToken()}` }
            })
            if (data.success) {
                setLikes(prev => {
                    if (prev.includes(currentUser._id))
                        return prev.filter(id => id !== currentUser._id);
                    else
                        return [...prev, currentUser._id];
                })
            }
        } catch (error) {
            console.log(error);
            throw new Error(error.message);
            toast.error(error.message);
        }

    }

    const handleSave = async () => {
        try {
            const { data } = await api.post('/api/save/save', { postId: post._id }, {
                headers: { Authorization: `Bearer ${await getToken()}` }
            })
            if (data.success) {
                setIsSaved(data.saved);
                toast.success(data.saved ? 'Post saved' : 'Post unsaved');
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

    return (
        <div className='shadow bg-plain p-4 rounded-lg space-y-3  w-full max-w-2xl' onDoubleClick={handleLike}>

            {/* user info  */}
            <div className='inline-flex items-center gap-3 cursor-pointer'
                onClick={() => navigate(`/profile/${post.user._id}`)}
            >
                <img src={post.user.profile_picture} alt="user" className='w-10 h-10 rounded-full object-cover shadow' />
                <div>
                    <div className='flex items-center gap-1 text-mute-3'>
                        <span>{post.user.full_name}</span>
                        <BadgeCheck className='w-4 h-4 text-accent' />
                    </div>

                    <div className='text-mute-2 text-sm'>
                        {moment(post.createdAt).fromNow()}
                    </div>
                </div>
            </div>

            {/* content  */}
            {
                post.content && (
                    <div
                        className='text-title text-sm plainspace-pre-line break-all overflow-hidden'
                        style={{ overflowWrap: 'anywhere' }}
                        dangerouslySetInnerHTML={{ __html: postWithHashtags }}
                    />
                )
            }

            {/* Images  */}
            <div className='grid grid-cols-2 gap-2'>
                {post.image_urls.map((img, index) => (
                    <img key={index} src={img} alt="post" className={`w-full h-48 object-cover rounded-lg ${post.image_urls.length === 1 && 'col-span-2 h-auto'}`} />
                ))}

            </div>

            {/* action buttons */}
            <div className='flex items-center gap-4 text-text-secondary text-sm pt-2 border-t border-mute-4'>
                <div className='flex items-center gap-1 cursor-pointer' onClick={handleLike}>
                    <Heart className={`w-4 h-4  ${likes.includes(currentUser._id) && 'fill-red-500 text-red-500'} `} />
                    <span>{likes.length}</span>
                </div>
                <div className='flex items-center gap-1 cursor-pointer' onClick={handleSave}>
                    <Bookmark className={`w-4 h-4 ${isSaved && 'fill-accent text-accent'}`} />
                </div>
            </div>


        </div>
    )
}

export default PostCard
