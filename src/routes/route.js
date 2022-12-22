const express =require('express')
const router=express.Router();
const usercontroller =require('../controllers/usercontroller');
const productcontroller =require('../controllers/productController')
const cartcontroller = require('../controllers/cartController')
const auth = require('../middleware/auth')

/*-------------------------user end points ---------------------------------*/
router.get('/user/:userId/profile',auth.authentication ,usercontroller.userget)
router.post('/register',usercontroller.createUser)
router.post('/login',usercontroller.userLogin)
router.put('/user/:userId/profile',usercontroller.updateUser)

/*-------------------------Products end points---------------------------------*/
router.post('/products',productcontroller.createProduct)
router.put('/products/:productId',productcontroller.updateproduct)
router.get('/products',productcontroller.getProductbyQuery)
router.get('/products/:productId',productcontroller.getProductById)

/*-------------------------cart end points---------------------------------*/
router.post('/users/:userId/cart' , cartcontroller.cartcreate)

module.exports=router;