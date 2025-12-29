import mongoose from "mongoose";

const saveSchema = new mongoose.Schema({
    user: { type: String, required: true, ref: 'User' },
    post: { type: String, required: true, ref: 'Post' },
},
    { timestamps: true })

const Save = mongoose.model('Save', saveSchema);
export default Save;