const express =require('express')
const router=express.Router();
const usercontroller =require('../controllers/usercontroller');

router.get('/user/:userId/profile',usercontroller.userget)
router.post('/register',usercontroller.createUser)


module.exports=router;