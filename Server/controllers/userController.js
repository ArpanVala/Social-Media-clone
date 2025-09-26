import imagekit from "../config/imageKit.js";
import { inngest } from "../inngest/index.js";
import Connection from "../models/Connection.js";
import Post from "../models/Post.js";
import User from "../models/User.js";
import fs from 'fs';

//get user data
export const getUserData = async(req, res) =>{
    try {
        const {userId} = await req.auth();
        //check if user exists
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({success:false, message:'User not found'});
        }
        return res.status(200).json({success:true, user});
    } catch (error) {
        return res.status(500).json({success:false, message:error.message});
    }
}

//update user data
export const updateUserData = async(req, res) =>{
    try {
        const {userId} = await req.auth();

        //check if user exists
        const tempUser = await User.findById(userId);
        if(!tempUser){
            return res.status(404).json({success:false, message:'User not found'});
        }

        //retrive data from request body
        let {full_name, username, bio, location} = req.body;

        //check username is there, if not, assign default username
        !username && (username = tempUser.username);

        //check if username is taken 
        if(username !== tempUser.username){

            const user = await User.findOne({username});
            if(user){
                username = tempUser.username; //assign old username if new username is taken
            }
        }

        const updatedData = {
            username,
            full_name: full_name || tempUser.full_name,
            bio: bio || tempUser.bio,
            location: location || tempUser.location,
        }


        const profile = req.files.profile && req.files.profile[0];
        const cover = req.files.cover && req.files.cover[0];

        //if profile or cover photo is present, upload to imagekit and get url
        if(profile)
        {
            const buffer = fs.readFileSync(profile.path);
            const response = await imagekit.upload({
                file:buffer,
                fileName: profile.originalname,
                })
            const url = imagekit.url({
                path: response.filePath,
                transformation:[
                    {quality: 'auto'},
                    {format: 'webp'},
                    {width: '512'}
                ]
            })
            updatedData.profile_picture = url;
        }
        if(cover)
        {
            const buffer = fs.readFileSync(cover.path);
            const response = await imagekit.upload({
                file:buffer,
                fileName: cover.originalname,
                })
            const url = imagekit.url({
                path: response.filePath,
                transformation:[
                    {quality: 'auto'},
                    {format: 'webp'},
                    {width: '1280'}
                ]
            })
            updatedData.cover_picture = url;
        }
        const user = await User.findByIdAndUpdate(userId, updatedData, {new:true});
        return res.status(200).json({success:true, user, message:'Profile updated successfully'});
    } catch (error) {
        return res.status(500).json({success:false, message:error.message});
    }
}

//discover users/ search users
export const discoverUsers = async(req, res) =>{
    try {
        const {input} = req.body;
      
        const allUsers = await User.find(
            {
                $or:[
                    {username: new RegExp(input, 'i')},
                    {full_name: new RegExp(input, 'i')},
                    {bio: new RegExp(input, 'i')},
                    {location: new RegExp(input, 'i')}
                ]
            }
        )
        return res.status(200).json({success:true, users: allUsers});
    } catch (error) {
        return res.status(500).json({success:false, message:error.message});
    }
}

//follow user
export const followUser = async(req, res) =>{
    try {
        const {userId} = await req.auth();
        const {id} = req.body; //id of user to be followed

        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({success:false, message:'User not found'});
        }

        //check if user alredy following
        if(user.following.includes(id)){
            return res.status(400).json({success:false, message:'You are already following this user'});
        }
        user.following.push(id);
        await user.save();

        // Add userId to the followers array of the user being followed
        const toUser = await User.findById(id);
        toUser.followers.push(userId);
        await toUser.save();    

       return res.status(200).json({success:true, message:'User followed successfully'});
    } catch (error) {
        return res.status(500).json({success:false, message:error.message});
    }
}

//unfollow user
export const unfollowUser = async(req, res) =>{
    try {
        const {userId} = await req.auth();
        const {id} = req.body; //id of user to be followed

        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({success:false, message:'User not found'});
        }

        //check if user not following
        if(!user.following.includes(id)){
            return res.status(400).json({success:false, message:'You are not following this user'});
        }
        user.following = user.following.filter(user => user != id);
        await user.save();

        // remove userId to the followers array of the user being followed
        const toUser = await User.findById(id);
        toUser.followers = toUser.followers.filter(follower => follower != userId);
        await toUser.save();

       return res.status(200).json({success:true, message:'User unfollowed successfully'});
    } catch (error) {
        return res.status(500).json({success:false, message:error.message});
    }
}
//send connection request
export const sendConnectionRequest = async(req, res) =>{
    try {
        const {userId}  = req.auth();
        const {id} = req.body; //id of user to be connected

        //check if user alreday connected
        const connection = await Connection.findOne({
            $or:[
                {from_user_id: userId, to_user_id: id},
                {from_user_id: id, to_user_id: userId}
            ]
        });

        if(!connection){
            const newConnection = await Connection.create({from_user_id:userId, to_user_id:id});

            //send connection request reminder
            await inngest.send({
                name:"app/connection-request",
                data:{connectionId : newConnection._id}
            });
            
            return res.status(201).json({success:true, message:'Connection request sent successfully'});
        }
        //if connected already
        else if(connection && connection.status === 'accepted')
        {
            return res.json({success:false, message:'You are already connected with this user'});
        }
        else if(connection && connection.status === 'rejected')
        {
            connection.status = 'pending';
            await connection.save();
            return res.status(200).json({success:true, message:'Connection request pending'});
        }
        return res.json({success:false, message:'Connection request already pending'});

    } catch (error) {
        res.status(500).json({success:false, message:error.message});
    }
}

//get user connection 
export const getUserConnections = async(req, res) =>{
    try {
        const {userId}  = req.auth();
        // Populate correct field name: connections (typo fix)
        const user = await User.findById(userId).populate('connections followers following');

        const connections = user.connections;
        const followers = user.followers;
        const following = user.following;

       const pendingConnections = (await Connection.find({to_user_id:userId, status:'pending'}).populate('from_user_id')).map(conn => conn.from_user_id);

        // Return keys expected by frontend slice
        res.status(200).json({ success: true, connections, followers, following, pendingConnections });

       
    } catch (error) {
        res.status(500).json({success:false, message:error.message});
    }
}

//accept user connection 
export const acceptConnectionRequest = async(req, res) =>{
    try {
        const {userId}  = req.auth();
        const {id} = req.body; //id of user to be connected

        const connection = await Connection.findOne({from_user_id:id, to_user_id:userId});

        if(!connection)
        {
            return res.status(404).json({success:false, message:'Connection request not found'});
        }

        //add to connections
        const user = await User.findById(userId);
        user.connections.push(id);
        await user.save();
        //add to connections
        const fromUser = await User.findById(id);
        fromUser.connections.push(userId);
        await fromUser.save();

        connection.status = 'accepted';
        await connection.save();

        return res.status(200).json({success:true, message:'Connection accepted successfully!'});
       

       
    } catch (error) {
        res.status(500).json({success:false, message:error.message});
    }
}
        
//get user profile
export const getuserProfile = async (req, res) => {
    try{
        const {paramId} = req.body; //paramId of user whose profile is to be fetched
        const user = await User.findById(paramId);
        if(!user){
            return res.status(404).json({success:false, message:'Profile not found'});
        }  
        const posts = await Post.find({user:paramId}).populate('user');
        res.status(200).json({success:true, user, posts});
    }
    catch(error){
        console.error(error);
        res.json({success:false, message:error.message});
    }
}