import express from "express";
import {protect} from "../middleware/auth.js"
import {upload} from "../config/multer.js";

const userRouter = express.Router();
import { getUserData, updateUserData, discoverUsers, followUser, unfollowUser, getUserConnections, acceptConnectionRequest, sendConnectionRequest } from "../controllers/userController.js";

userRouter.get('/data', protect, getUserData);
userRouter.put('/update', upload.fields([{ name: 'profile', maxCount: 1 }, { name: 'cover', maxCount: 1 }]), protect, updateUserData);
userRouter.post('/discover', protect, discoverUsers);
userRouter.post('/follow', protect, followUser);
userRouter.post('/unfollow', protect, unfollowUser);

userRouter.get('/connections', protect, getUserConnections);
userRouter.post('/accept',protect, acceptConnectionRequest);
userRouter.post('/connect', protect, sendConnectionRequest);


export default userRouter;