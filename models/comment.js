import mongoose from 'mongoose';

const commentSchema = mongoose.Schema({
    content: String,
    writtenBy: String,
    likes: { type: [String], default: [] },
    createdAt: { type: Date, default: new Date() }
})

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;