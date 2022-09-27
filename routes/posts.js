import express from "express";
import { getPosts, getPost, getPostsBySearch, getPostsByAuthor, createPost, updatePost, deletePost, likePost, commentPost } from "../controllers/posts.js";
import auth from '../middleware/auth.js';
import { upload } from '../services/fileUpload.js';

const router = express.Router();

router.get('/', getPosts);
router.get('/:id', getPost);
router.get('/search/content', getPostsBySearch);
router.get('/search/author', getPostsByAuthor);
router.post('/', auth, upload.single("selectedFile"), createPost);
router.patch('/:id', auth, upload.single("selectedFile"), updatePost);
router.delete('/:id', auth, deletePost);
router.patch('/:id/likePost', auth, likePost)
router.post('/:id/commentPost', auth, commentPost)

export default router;