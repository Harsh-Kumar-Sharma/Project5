const express =require('express')
const router=express.Router();
const usercontroller =require('../controllers/usercontroller');

router.get('/user/:userId/profile',usercontroller.userget)
router.post('/register',usercontroller.createUser)
router.post('/login',usercontroller.userLogin)
router.put('/user/:userId/profile',usercontroller.updateUser)



module.exports=router;