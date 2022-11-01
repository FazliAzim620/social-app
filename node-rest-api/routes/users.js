const route=require("express").Router();
const User=require('../Model/User');
const bcrypt=require('bcrypt');
// update the user

route.put('/:id',async(req,res)=>{
   
    if(req.body.userId === req.params.id || req.body.isAdmin){
       
        if(req.body.password){
            try{
                   const salt=await bcrypt.genSalt(10);
                 req.body.password=await bcrypt.hash(req.body.password,salt)
            }catch(err){
                res.status(500).json(err)
            }
        }
        try{
            const user=await User.findByIdAndUpdate(req.params.id,{
                $set:req.body
            });
            res.status(200).send("Account has been updated")
        }catch(err){
            res.status(500).json(err)
        }
    }
    else{
        res.status(403).json('You can update Only Your Account')
    }

    
})
//delete user
route.delete('/:id',async(req,res)=>{
    if(req.body.userId === req.params.id || req.body.isAdmin){
       try{
        // const result=await User.deleteOne({_id:req.params.id}); // this is alson working
        const user=await User.findByIdAndDelete(req.params.id)
        res.status(200).json('Account has been deleted success fully')
       }catch(err){
           res.status(500).json(`you have this error :${err}`)
       }
    }
    else{
       return res.status(403).json('You can delete only Your Account')
    }
})
// find user
route.get('/',async(req,res)=>{
    
const userId=req.query.userId;
const username=req.query.username
    try{
        const user=userId?await User.findById(userId):await User.findOne({username:username})
        const{password,updatedAt,...other}=user._doc;
        res.status(200).json(other)
    }catch(err){
        res.status(403).json(err)
    }

})
// follower user
route.put('/:id/follow',async(req,res)=>{
   if(req.body.userId !== req.params.id){
       try{
        const user=await User.findById(req.params.id);
        const currentUser=await User.findById(req.body.userId);
        if(!user.followers.includes(req.body.userId)){
            await user.updateOne({$push:{followers:req.body.userId}});
            await currentUser.updateOne({$push:{following:req.params.id}});
            res.status(200).json('User have been followed')
        }
        else{
            res.status(500).json('You already follow the user')
        }

       }catch(err){
           res.status(500).json(err)
       }

   }
   else{
       res.status(403).json('You can not Follow your self')
   }

})
// Unfollowe user
route.put('/:id/unfollow',async(req,res)=>{
   if(req.body.userId !== req.params.id){
       try{
        const user=await User.findById(req.params.id);
        const currentUser=await User.findById(req.body.userId);
        if(user.followers.includes(req.body.userId)){
            await user.updateOne({$pull:{followers:req.body.userId}});
            await currentUser.updateOne({$pull:{following:req.params.id}});
            res.status(200).json('User have been Unfollowed')
        }
        else{
            res.status(500).json('You do not follow the user')
        }

       }catch(err){
           res.status(500).json(err)
       }

   }
   else{
       res.status(403).json('You can not Unfollow yourself')
   }

})
/////////////  find friend
route.get('/friends/:userId',async(req,res)=>{
 try{
    const user=await User.findById(req.params.userId);
    const friends=await Promise.all(
        user.following.map((friendId)=>{
            return User.findById(friendId)
        })
    );
    let friendList=[];
    friends.map((friend)=>{
        const {_id,username,profileImage}=friend;
        friendList.push(_id,username,profileImage)
    })
     res.status(200).json(friendList)
 }catch(err){
     res.status(500).json(err)
 }
})
module.exports=route;