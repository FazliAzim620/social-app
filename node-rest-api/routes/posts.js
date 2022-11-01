const router = require("express").Router();
const Post = require("../Model/Post");
const User= require('../Model/User')
///////////////// create posts
router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    await newPost.save();
    res.status(200).send(newPost);
  } catch (err) {
    res.status(500).json(err);
  }
});
///////////////////  update posts
router.put("/:id", async (req, res) => {
  try {
    const userpost = await Post.findById(req.params.id);
    if (userpost.id === req.body.userId) {
      await userpost.updateOne({ $set: req.body });
      res.status(200).json("Successfuly Update ");
    } else {
      res.status(403).json("You can update only your posts");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
///////////// delete post
router.delete("/:id", async (req, res) => {
  try {
    const userpost = await Post.findById(req.params.id);
    if (userpost.userId == req.body.userId) {
      await userpost.deleteOne();
      res.status(200).json("Your Post is Deleted Successfuly");
    } else {
      res.status(500).json("You can delete only Your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
//////////// like the post
router.put("/:id/like", async (req, res) => {
  try {
    const userpost = await Post.findById(req.params.id);
    if (!userpost.likes.includes(req.body.userId)) {
      await userpost.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("You like the post");
    } else {
      res.status(403).json("you already like the post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
////////////////  unlike post
router.put("/:id/unlike", async (req, res) => {
  try {
    const userpost = await Post.findById(req.params.id);

    if (userpost.likes.includes(req.body.userId)) {
      await userpost.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("unlike the post ");
    } else {
      res.status(403).json("You already not like");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
///////////////// show like of the post
router.get("/:id/showlike", async (req, res) => {
  try {
    const postlike = await Post.findById(req.params.id);
    like = await postlike.likes;

    res.status(200).json(` 👍 ${like.length}`);
  } catch (err) {
    res.status(500).json(err);
  }
});
//////////////////// get post
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const { updatedAt, ...other } = post._doc;

    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
});
/////////// timeline post
router.get("/timeline/user/:userId", async (req, res) => {
  
  try {
      
    const currentUser = await User.findById(req.params.userId);
    const userpost = await Post.find({ userId:currentUser._id });

    const friendpost = await Promise.all(
      currentUser.following.map((friendId) => {
        return  Post.find({ userId: friendId });
      })
    );
   
    res.json(userpost.concat(...friendpost));
    res.status(200).json(currentUser)
  } catch (err) {
    res.status(500).json(err);
  }
});
router.get('/profile/:username',async(req,res)=>{
 
  try{
    const user=await User.findOne({username:req.params.username});
    const userpost=await Post.find({userId:user._id})
    res.status(200).json(userpost)
  }catch(e){
    res.status(500).json(e)
  }
  
})

module.exports = router;
