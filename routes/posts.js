import express from "express";
import { getPosts, getPost, getPostsBySearch, getPostsByAuthor, createPost, updatePost, deletePost, likePost } from "../controllers/posts.js";
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', getPosts);
router.get('/:id', getPost);
router.get('/search/content', getPostsBySearch);
router.get('/search/author', getPostsByAuthor);
router.post('/', auth, createPost);
router.patch('/:id', auth, updatePost);
router.delete('/:id', auth, deletePost);
router.patch('/:id/likePost', auth, likePost)


export default router;