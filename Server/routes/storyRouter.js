import express from 'express';
import { protect } from '../middleware/auth';
import {upload} from '../config/multer.js'
import { addUserStory, getStories } from '../controllers/storyController.js';
const storyRouter = express.Router();

storyRouter.get('/get',protect,getStories);
storyRouter.post('/create',upload.single('media'),protect,addUserStory);

export default storyRouter;
