import mongoose from "mongoose";
import Post from "../models/post.model.js";
import APIfeatures from "../utils/apiFeatures.js";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const createPost = async (req, res) => {
    try {
        // Mistake before: destructuring req.body directly can throw when body is missing.
        const { title, content, author: bodyAuthor } = req.body || {};

        // Previously: trim() could run before type checks and crash for non-string input.
        if (typeof title !== "string" || typeof content !== "string") {
            return res.status(400).json({ message: "Title and content must be strings" });
        }

        const cleanTitle = title.trim();
        const cleanContent = content.trim();
        if (!cleanTitle || !cleanContent) {
            return res.status(400).json({ message: "Title and content are required" });
        }

        // Previously: author could be missing even though schema requires it.
        // Prefer req.user._id (from auth middleware). Fallback to body for now if route isn't protected yet.
        const author = req.user?._id || bodyAuthor;
        if (!author || !isValidObjectId(String(author))) {
            return res.status(400).json({ message: "Valid author is required" });
        }

        const post = await Post.create({
            title: cleanTitle,
            content: cleanContent,
            author,
        });

        return res.status(201).json({ status: "success", post });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong.." });
    }
};

export const readAllPost = async (req, res) => {
    try {
        const features = new APIfeatures(await Post.find().paginate().sort("-createdAt"));
        // Previously: (await Post.find()).sort({createdAt:-1}) sorts an array with wrong argument.
        const posts = await features.query;

        return res.status(200).json({ status: "success", posts });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong.." });
    }
};

export const readPost = async (req, res) => {
    try {
        const { id } = req.params;

        // Previously: checking typeof id for number is wrong for route params.
        if (!id || !isValidObjectId(id)) {
            return res.status(400).json({ message: "Invalid post id" });
        }

        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ message: "No post found" });
        }
        
        return res.status(200).json({ status: "success", post });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong.." });
    }
};

export const updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        // Mistake before: destructuring req.body directly can throw when body is missing.
        const { title, content } = req.body || {};
        const userId = req.user?._id;

        if (!id || !isValidObjectId(id)) {
            return res.status(400).json({ message: "Invalid post id" });
        }

        if (!userId) {
            return res.status(403).json({ message: "Not Authorized" });
        }

        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ message: "Not Found" });
        }

        if (userId.toString() !== post.author.toString()) {
            return res.status(403).json({ message: "Not Authorized" });
        }

        // Previously: updateOne() result was returned instead of the updated document.
        if (title !== undefined) {
            if (typeof title !== "string" || !title.trim()) {
                return res.status(400).json({ message: "Invalid title" });
            }
            post.title = title.trim();
        }

        if (content !== undefined) {
            if (typeof content !== "string" || !content.trim()) {
                return res.status(400).json({ message: "Invalid content" });
            }
            post.content = content.trim();
        }

        await post.save();

        return res.status(200).json({ message: "success", post });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong.." });
    }
};

export const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?._id;

        if (!id || !isValidObjectId(id)) {
            return res.status(400).json({ message: "Invalid post id" });
        }

        if (!userId) {
            return res.status(403).json({ message: "Not Authorized" });
        }

        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ message: "Not Found" });
        }

        if (userId.toString() !== post.author.toString()) {
            return res.status(403).json({ message: "Not Authorized" });
        }

        await post.deleteOne();

        return res.status(200).json({ message: "success" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong.." });
    }
};
