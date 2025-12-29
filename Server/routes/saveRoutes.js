import express from 'express';
import { savePost, getSavedPosts, checkSaved } from '../controllers/saveController.js';
import { protect } from '../middleware/auth.js';

const saveRouter = express.Router();

saveRouter.post('/save', protect, savePost);
saveRouter.get('/saved', protect, getSavedPosts);
saveRouter.get('/check/:postId', protect, checkSaved);

export default saveRouter;

