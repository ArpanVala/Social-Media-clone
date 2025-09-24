import fs from "fs"
import imagekit from "../config/imageKit.js";
import Message from "../models/Message.js";

//create an empty object to store server side event(SSE) connections
const connections = {};

//controller function for SSE endpoints
export const sseController = async(req, res) => {
    const {userId} = req.params;

    console.log("New Client Connected: " + userId);

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache'),
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');

    //add client's response object to connections object
    connections[userId] = res;

    //send initial event to client
    res.write('log: Connected to SSE stream\n\n');

    //handle client disconnection
    req.on('close',()=>{
        //remove client's response object from connections object
        delete connections[userId];
        console.log('Client Disconnected: ' + userId);
    })
}

//send message 
export const sendMessage = async(req, res) => {
    try {

        const {userId} = req.params;
        const { to_user_id, text} = req.body;
        const image = req.file;

        let media_url = '';
        let message_type = image ? 'image' : 'text';
        //use single quotes for characters and double quotes for strings
        if(media_type === "image")
        {
            const fileBuffer = fs.readFileSync(image.path);
            const response = await imagekit.upload({
                file: fileBuffer,
                fileName: image.originalname
            })

            media_url =  imagekit.url({
                path: response.filePath,
                transformation:[
                    {quality:"auto"},
                    {format:"webp"},
                    {width:"1280"}]
            })
        }

        const message = await Message.create({
            from_user_id: userId,
            to_user_id,
            text,
            media_url,
            message_type
        })

        res.json({success:true, message});

        //send message to to_user_id using SSE
        const messageWithUserData = await Message.findById(message._id).populate('from_user_id');

        if(connections[to_user_id])
        {
            connections[to_user_id].write(`data: ${JSON.stringify(messageWithUserData)}\n\n`);
        }
        
    } catch (error) {
        console.error(error);
        return res.json({success:false, message:error.message});
        
    }
}

//get chat messages
export const getChatMessages = async (req, res) => {
    try {

        const {userId} = req.auth();
        const {to_user_id} = req.params;

        const messages = await Message.find({
            $or:[
                {from_user_id:userId, to_user_id},
                {from_user_id:to_user_id, to_user_id:userId}
            ]
        }).sort({created_at: -1});
        
        await Message.updateMany({from_user_id:to_user_id, to_user_id:userId}, {seen:true});

        res.json({success:true, messages});

    } catch (error) {
        console.error(error);
        return res.json({success:false, message:error.message});
    }
}

//get user's recent messages
export const getUserRecentMessages = async (req, res) => {
    try {
        const {userId} = req.auth();
        const messages = await Message.find({from_user_id: userId}).populate('from_user_id to_user_id').sort({created_at: -1});

        res.json({success:true, messages});
        
    } catch (error) {
        console.error(error);
        return res.json({success:false, message:error.message});
    }
}