import mongoose from 'mongoose';
import PostMessage from '../models/postMessage.js';

export const getPost = async (req, res) => {
    const { id: _id } = req.params;

    try {
        const post = await PostMessage.findById(_id);
        res.status(200).send(post);
    } catch (error) {
        res.status(404).send({ message: error.message });
    }
}

export const getPosts = async (req, res) => {
    const { page } = req.query;

    try {
        const limit = 6;
        const startIndex = (Number(page) - 1) * limit;
        const total = await PostMessage.countDocuments({});

        const posts = await PostMessage.find().sort({ _id: -1 }).limit(limit).skip(startIndex);
        res.status(200).send({ data: posts, currentPage: Number(page), numberOfPages: Math.ceil(total / limit) });
    } catch (error) {
        res.status(404).send({ message: error.message });
    }
} 

export const getPostsBySearch = async (req, res) => {
    const { searchQuery, tags } = req.query;

    try {
        const titleOrMessageString = new RegExp(searchQuery, 'i');
        const posts = await PostMessage.find({ $or: [ { title: { $regex: titleOrMessageString } }, { message: { $regex: titleOrMessageString } }, { tags: { $in: tags.split(',') } } ] });
        res.send({ data: posts });
    } catch (error) {
        res.status(404).send({ message: error.message })
    }
}

export const getPostsByAuthor = async (req, res) => {
    const { searchAuthor } = req.query;

    try {
        const authorString = new RegExp(searchAuthor, 'i');
        const posts = await PostMessage.find({ name: { $regex: authorString } });

        res.send({ data: posts });
    } catch (error) {
        res.status(404).send({ message: error.message })
    }
}

export const createPost = async (req, res) => {
    const post = req.body;
    const newPost = new PostMessage({ ...post, creator: req.userId, createdAt: new Date().toISOString(), selectedFile: req?.file?.location });
    
    try {
       await newPost.save();
       res.status(201).send(newPost); 
    } catch (error) {
       res.status(409).send({ message: error.message }); 
    }
}

export const updatePost = async (req, res) => {
    const { id: _id } = req.params;
    const post = req.body;

    if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('The document does not exist!');
    
    const updatedPost = await PostMessage.findByIdAndUpdate(_id, {...post, _id }, { new: true });
    res.send(updatedPost);
}

export const deletePost = async (req, res) => {
    const { id: _id } = req.params;
    
    if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('The document does not exist!');

    await PostMessage.findByIdAndRemove(_id);
    res.send({ message: 'Document deleted successfully' })
}

export const likePost = async (req, res) => {
    const { id: _id } = req.params;

    if(!req.userId) return res.send({ message: 'User unauthenticated!'});  
    if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('The document does not exist!');

    const post = await PostMessage.findById(_id);
    const index = post.likes.findIndex((_id) => _id === String(req.userId));

    if(index === -1) {
        post.likes.push(req.userId);
    } else {
        post.likes = post.likes.filter((_id) => _id !== String(req.userId));
    }

    const updatedPost = await PostMessage.findByIdAndUpdate(_id, post, { new: true });
    res.send(updatedPost);
}

export const commentPost = async (req, res) => {
    const { id } = req.params;
    const { value } = req.body;

    const post = await PostMessage.findById(id);
    post.comments.push(value);

    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });
    res.send(updatedPost);
}