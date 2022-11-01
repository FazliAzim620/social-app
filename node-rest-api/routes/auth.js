const route = require("express").Router();
const User = require("../Model/User");
const bcrypt = require("bcrypt");

route.post("/register", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    const user = await new User({
      username: req.body.username,
      email: req.body.email,
      password: hashPassword,
    });
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});
route.post('/login',async (req,res)=>{
    try{
    const user=await User.findOne({email:req.body.email})
    if(!user) {res.status(404).send('User Not Found')}
    const cpassword=await bcrypt.compare(req.body.password,user.password);
    !cpassword && res.status(404).send(" Invalid Password")
    res.json(user)

    }catch(err){
        console.log(err)
    }
})
module.exports = route;
