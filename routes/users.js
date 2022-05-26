const router = require("express").Router();
const User = require("../models/User");
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

//Follower count
router.get("/followers/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user.followers.length);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Followings count
router.get("/followings/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user.followings.length);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
