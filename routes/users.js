const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt"); //its async function so we need to use await

//UPDATE USER
router.put("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {

        if (req.body.password) {
            try {

                //generate salt to hash the password
                const salt = await bcrypt.genSalt(10);

                //hash the password
                req.body.password = await bcrypt.hash(req.body.password, salt);

                //if error show error
            } catch (error) {
                res.status(500).json({ error });
            }
        }

        //Actual update of the user
        try {

            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            });
            res.status(200).json("Account has been updated");

            //if error show error
        } catch (error) {
            res.status(500).json({ error });
        }
    } else {
        res.status(403).json({ msg: "You can update only your profile" });
    }
});


//DELETE A USER
router.delete("/:id", async (req, res) => {

    if (req.body.userId === req.params.id || req.body.isAdmin) {


        try {
            const user = await User.findByIdAndDelete(req.params.id);
            res.status(200).json("Account has been deleted successfully");

            //if error show error
        } catch (error) {
            res.status(500).json({ error });
        }
    } else {
        res.status(403).json({ msg: "You can delete only your profile" });
    }
});



//GET A USER
router.get("/", async (req, res) => {
    //query
    const userId = req.query.userId
    const username = req.query.username

    try {
        const user = userId
            ? await User.findById(req.params.id)
            : await User.findOne({ username })

        //this info is not needed to be sent to the client//not showing credentials to user
        const { password, updatedAt, ...others } = user._doc

        res.status(200).json(others);//user if we dont use above line

        //if error show error
    } catch (error) {
        res.status(500).json({ error });
    }

})


//FOLLOW A USER
//following means we gonna update something so put method
router.put("/:id/follow", async (req, res) => {
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




//UNFOLLOW A USER
router.put("/:id/unfollow", async (req, res) => {
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



module.exports = router;
