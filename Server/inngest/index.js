import { Inngest } from "inngest";
import User from "../models/User.js";
import sendEmail from "../config/nodeMailer.js"

// Create a client to send and receive events
export const inngest = new Inngest({ id: "atom-app" });

//ingest functio to sync user creation from clerk to mongodb
const syncUserCreation = inngest.createFunction(
    {id:'sync-user-from-clerk'},
    {event:'clerk/user.created'},
    async({event})=>{

        const {id, email_addresses,first_name, last_name, image_url} = event.data;

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
        const {id, email_addresses, first_name, last_name, image_url} = event.data;
        const updateduserData = {
            email:email_addresses[0].email_address,
            full_name:first_name + ' ' + last_name,
            profile_picture:image_url
        }

        await User.findByIdAndUpdate(id, updateduserData);

    }
)

//inngest function to delete user from database
const syncUserDeletion = inngest.createFunction(
    {id: 'delete-user-with-clerk'},
    {event:'clerk/user.deleted'},
    async ({event})=>{
        const {id} = event.data;

        await User.findByIdAndDelete(id);
        console.log('User deleted from MongoDB...');

    }
)

//inngest function to send reminder when a new conncetion request is added
const sendNewConnectionRequestReminder = inngest.createFunction(
    {id: "send-new-connection-request-reminder"},
    {event: "app/connection-request"},
    async({event, step}) => {
        const {connectionid} = event.data;

        await step.run('send-connection-request-main',async()=>{
            const connection = await Connection.findById(connectionid).populate('from_user_id to_user_id');

            const subject = "New Connection Request -Atom Social Media";

            const body = `
                    <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2>Hi ${connection.to_user_id.full_name}, </h2>
                    <p>You have a new connection request from ${connection.from_user_id.full_name} - @${connection.from_user_id.username}</p>
                    <p>Click <a href="${process.env.FRONTEND_URL}/connections" style="color:#10b981;">here</a> to accept or reject the request</p>
                    <br/>
                    <p>Thanks, <br/>Atom Social - Stay Connected</p>
                    </div>`;

            await sendEmail({
                to: connection.to_user_id.email,
                subject,
                body
            })

            return {message:"Reminder sent."}
        })
    }
)

// Create an empty array where we'll export future Inngest functions
export const functions = [
    syncUserCreation,
    syncUserUpdation,
    syncUserDeletion,
    sendNewConnectionRequestReminder
];