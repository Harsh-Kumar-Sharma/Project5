const usermodel = require('../Models/usermodel') 
const { isValidObjectId } = require('mongoose');

const userget = async (req,res)=>{
    try{
   const userid=req.param
   
   if(!isValidObjectId(userid)){
    return res.status(400).send({ status: false, message:"userId is not vaild" })
  }

   if(userid!=req.userid){
    return res.status(403).send({status:false,message:"not authoristed"})
   }
   const getuser = await usermodel.findOne({_id:userid})
   return res.status(200).send({status:true,message: "User profile details",data:getuser})
    }
    catch(err){
        return res.status(500).send({status:false,message:err.message})
    }
}

module.exports={userget}