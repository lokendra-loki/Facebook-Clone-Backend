const Post = require("../models/Post");
const User = require("../models/User");
const createError = require("../utils/error");

//Create Post
const createPost = async (req, res, next) => {
  try {
    const newPost = new Post(req.body);
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (error) {
    return next(createError(500, "Server Error while creating post"));
  }
};

//Update Post
const updatePost = async (req, res, next) => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(updatedPost);
  } catch (error) {
    return next(createError(500, "Server Error while updating post"));
  }
};

//Delete Post
const deletePost = async (req, res, next) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.id);
    res.status(200).json(deletedPost);
  } catch (error) {
    return next(createError(500, "Server Error while deleting post"));
  }
};

//Get a Post
const getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (error) {
    return next(createError(500, "Server Error while getting post"));
  }
};

//Get user's posts only
// const getUserPosts = async (req, res, next) => {
//   try {
//     const user = await User.findById(req.params.id);
//     const posts = await Post.find({ user: user._id });
//     res.status(200).json(posts);
//   } catch (error) {
//     return next(createError(500, "Server Error while getting user's posts"));
//   }
// }
//

//Get user post only
const getUserPostOnly = async (req, res, next) => {
  const { userID } = req.body;
  try {
    const getUserKoPosts = await Post.find({ userID });
    return (res = res.status(200).json(getUserKoPosts));
  } catch (error) {
    return next(createError(500, "Server Error while getting userKoPosts "));
  }
};

//GetAll Posts
const getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    return next(createError(500, "Server Error while getting all posts"));
  }
};

//export
module.exports = {
  createPost,
  updatePost,
  deletePost,
  getPost,
  getAllPosts,
  getUserPostOnly,
};