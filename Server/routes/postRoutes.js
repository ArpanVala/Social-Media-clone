import express from 'express';
import { addPost, getFeedPosts, likePost, getLikedPosts } from '../controllers/postController.js';
import { upload } from '../config/multer.js';
import { protect } from '../middleware/auth.js';

const postRouter = express.Router();

postRouter.post('/add', upload.array('images', 4), protect, addPost);
postRouter.get('/feed', protect, getFeedPosts);
postRouter.post('/like', protect, likePost);
postRouter.get('/liked', protect, getLikedPosts);

export default postRouter;
