import fs from "fs";
import imagekit from "../config/imageKit.js";
import Story from "../models/Story.js";
import User from "../models/User.js";

//add story 
export const addUserStory = async (req, res) => {
    try {
        const {userid} = req.auth();
        const {content,  media_type, background_color} = req.body;
        const media = req.file;

        const media_url = '';

        if(media_type == 'image' || media_type == 'video')
        {
            const fileBuffer = fs.readFileSync(media.path);
            //upload to imagekit
            const response = await imagekit.upload({
                file: fileBuffer,
                fileName: media.originalname,
            })
            media_url = response.url;
        }

        const story = await Story.create({
            user:userid,
            content,
            media_url,
            media_type,
            background_color
        })

        res.json({success:true, message:"Story created successfully"});


    } catch (error) {
        console.error(error);
        return res.status(500).json({success:false, message:error.message});
        
    }

}


//get user story
export const getStories = async (req, res) => {
    try {
        const {userId} = req.auth();
        const user = await User.findById(userId);

        //user connections and followings
        const userIds = [userId, ...user.connections, ...user.following];

        const stories = await Story.find({user: {$in : userIds}}).populate('user').sort({createdAt: -1});

        res.json({success:true, stories});

     } catch (error) {
        console.error(error);
        return res.status(500).json({success:false, message:error.message});
        
    }

}