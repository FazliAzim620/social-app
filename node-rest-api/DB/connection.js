const mongoose=require('mongoose');
const ConnectDB=async()=>{
    try{
        mongoose.connect(process.env.MongoDB_URL,()=>{
            console.log("DB is connected successfuly")
        })
    }catch(err){
        console.log('not connected the DB due to :'+err)
    }
}
module.exports=ConnectDB;