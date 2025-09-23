import fs from "fs";
import Post from "../models/Post.js";
import imagekit from "../config/imageKit.js";
import User from "../models/User.js";

//add post
export const addPost = async (req, res) => {
    try {
        const {userId} = req.auth();
        const {content, post_type} = req.body;
        const images = req.files;

        let image_urls = [];

        if(images.length)
        {
            image_urls = await Promise.all(
                images.map(async(img) =>{
                    const fileBuffer = fs.readFileSync(img.path);
                    //upload to imagekit
                    const response = await imagekit.upload({
                        file: fileBuffer,
                        fileName: img.originalname,
                        folder:"posts",
                    })
                    //return url
                    const url = imagekit.url({
                        path:response.filePath,
                        transformation:[{format:'webp', width:'1280', quality:"auto"}],
                    });

                    return url;

                    })
            )
        }
        await Post.create({
            user: userId,
            content,
            image_urls,
            post_type
        })

        res.json({success:true, message:"Post created successfully"});
    } catch (error) {
        console.error(error);
          return res.status(500).json({success:false, message:error.message});
        
    }
}

//get feed post data
export const getFeedPosts = async (req, res) => {  
    try {
        const {userId} = req.auth();
        const user = await User.findById(userId);

        //user connections and followings
        const userIds = [userId, ...user.connections, ...user.following];
        const posts = await Post.find({user:{$in : userIds}}).populate('user').sort({createdAt: -1});

        res.json({success:true, posts});
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({success:false, message:error.message});
    }
 }

 //like unlike post
export const likePost = async (req, res) => {
    try {
        const {userId} = req.auth();
        const {postId} = req.body;

        const post = await Post.findById(postId);

        if(post.likes_count.includes(userId))
        {
            //unlike
            post.likes_count = post.likes_count.filter(pid =>  pid !== userId);
            await post.save();
            return res.json({success:true, message:"Post unliked"});
        }
        else{
            //like
            post.likes_count.push(userId);
            await post.save();
            return res.json({success:true, message:"Post liked"});
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({success:false, message:error.message});
    }
}