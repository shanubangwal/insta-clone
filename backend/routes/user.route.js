import express from 'express';
import { editProfile, followorUnfollowUser, getProfile, getSuggestedUser, login, logout, register } from '../controllers/user.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import upload from '../middlewares/multer.js';
import { User } from '../models/user.model.js';
const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/:id/profile').get(isAuthenticated, getProfile );
router.route('/profile/edit').post(isAuthenticated, upload.single('profilePhoto'),editProfile);
router.route('/suggested').get(isAuthenticated, getSuggestedUser);
router.route('/followorunfollow/:id').post(isAuthenticated, followorUnfollowUser);


export default router;

