const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");
const bcrypt = require("bcrypt");
const {
  updateUser,
  getUser,
  getAllUsers,
  deleteUser,
} = require("../controllers/userController");

//Update
router.put("/update/:id", updateUser);

//Get
router.get("/get/:id", getUser);

//GetAll
router.get("/getAll", getAllUsers);

//Delete
router.delete("/delete/:id", deleteUser);

//Follow
router.put("/follow/:id", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { followings: req.params.id } });
        res.status(200).json("user has been followed");
      } else {
        res.status(403).json("you already follow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you cant follow yourself");
  }
});

//Unfollow
router.put("/unfollow/:id", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({ $pull: { followings: req.params.id } });
        res.status(200).json("user has been unfollowed");
      } else {
        res.status(403).json("you dont follow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you cant unfollow yourself");
  }
});

//Bookmark
router.put("/bookmark/:postId", async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    const currentUser = await User.findById(req.body.userId);
    if (!currentUser.bookmarks.includes(req.params.postId)) {
      await currentUser.updateOne({ $push: { bookmarks: req.params.postId } });
      res.status(200).json("post has been bookmarked");
    } else {
      await currentUser.updateOne({ $pull: { bookmarks: req.params.postId } });
      res.status(200).json("post has been Unbookmarked");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//All bookmark post id
router.get("/bookmarkPosts/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user.bookmarks);
  } catch (err) {
    res.status(500).json(err);
  }
});

//All followers (id)
router.get("/allFollowers/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user.followers);
  } catch (err) {
    res.status(500).json(err);
  }
});

//All followings (id)
router.get("/allFollowings/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user.followings);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
