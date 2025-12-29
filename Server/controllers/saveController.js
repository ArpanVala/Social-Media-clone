import Save from "../models/Save.js";
import Post from "../models/Post.js";

// Save or unsave a post
export const savePost = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { postId } = req.body;

        // Check if post exists
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        // Check if already saved
        const existingSave = await Save.findOne({ user: userId, post: postId });

        if (existingSave) {
            // Unsave
            await Save.findByIdAndDelete(existingSave._id);
            return res.json({ success: true, message: "Post unsaved", saved: false });
        } else {
            // Save
            await Save.create({
                user: userId,
                post: postId
            });
            return res.json({ success: true, message: "Post saved", saved: true });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: error.message });
    }
}

// Get all saved posts for a user
export const getSavedPosts = async (req, res) => {
    try {
        const { userId } = req.auth();

        // Get all saves for the user with populated post data
        const saves = await Save.find({ user: userId })
            .populate({
                path: 'post',
                populate: {
                    path: 'user',
                    select: 'full_name username profile_picture'
                }
            })
            .sort({ createdAt: -1 });

        // Extract posts from saves
        const posts = saves.map(save => save.post).filter(post => post !== null);

        res.json({ success: true, posts });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: error.message });
    }
}

// Check if a post is saved by the user (for frontend state)
export const checkSaved = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { postId } = req.params;

        const saved = await Save.findOne({ user: userId, post: postId });

        res.json({ success: true, saved: !!saved });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: error.message });
    }
}

