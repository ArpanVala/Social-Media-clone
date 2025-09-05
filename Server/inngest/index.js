import { Inngest } from "inngest";
import User from "../models/User.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "atom-app" });

//ingest functio to sync user creation from clerk to mongodb
const syncUserCreation = inngest.createFunction(
    {id:'sync-user-from-clerk'},
    {event:'clerk/user.created'},
    async({event})=>{

        const[id, email_addresses,first_name, last_name, image_url] = event.data;

        let username = email_addresses[0].email_address.split('@')[0]; //default username from email befor '@'
        const user = await User.findOne({username});
        if(user)
            {
                username = username + Math.floor(Math.random() * 1000); //append random number if username exists
            }

        let full_name = first_name + ' ' + last_name;

        const userData = {
            _id:id,
            email:email_addresses[0].email_address,
            full_name,
            profile_picture:image_url,
            username
        }

        await User.create(userData);
        console.log('User created in MongoDB...');
    }
)

//Ingest function to update user data in database
const syncUserUpdation = inngest.createFunction(
    {id :'update-user-from-clerk'},
    {event:'clerk/user.updated'},
    async ({event}) => {
        const [id,email_addresses, first_name, last_name, image_url] = event.data;
        const updateduserData = {
            email:email_addresses[0].email_address,
            full_name:first_name + ' ' + last_name,
            profile_picture:image_url
        }

        await User.findByIdAndDelete(id, updateduserData);
      
    }
)

//inngest function to delete user from database
const syncUserDeletion = inngest.createFunction(
    {id: 'delete-user-with-clerk'},
    {event:'clerlk/user.deleted'},
    async ({event})=>{
        const [id] = event.data;

        await User.findByIdAndDelete(id);
        console.log('User deleted from MongoDB...');

    }
)

// Create an empty array where we'll export future Inngest functions
export const functions = [
    syncUserCreation,
    syncUserUpdation,
    syncUserDeletion
];