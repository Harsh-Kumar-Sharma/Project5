const cartModel = require('../Models/cartModel')
const productModel =require('../Models/productsModels')
const usermodel  = require('../Models/usermodel')

const cartcreate = async (req,res)=>{

    try
    {
   const  body = req.body;
   const userid =req.params.userId
   
   if(!validator.isValidObjectId(userid)){
    return res.status(400).send({status: false, message:"userId is not vaild"})
  }

   if(userid!=req.userId){
    return res.status(400).send({status:false,message:"please provide valid userid"})
   }
   const getuser = await usermodel.findOne({_id:userid,isDeleted:false})

   if(!getuser){
    return res.status(404).send({status:false,message:"user is not register"})
   }
   
   if(Object.keys(body).length==0 ){
    return res.status(400).send({status:false,message:"Please provide body"})
 }

const {items,totalPrice,totalItems}=body

if(items.length == 0){
    return res.status(400).send({status:false,message:"Please provide items"}) 
}
const getproduct = await productModel.find({isDeleted:false}).select({_id:1})
items.map(x=>{
    if(!validator.isValidObjectId(x.productId)){
        return res.status(400).send({status: false, message:"productId is not vaild"})
      }
      if(!getproduct.includes(x.productId)){
        return res.status(404).send({status: false, message:"productId is not register `${x.productId} `"})
      }
      if(!validator.valid(x.quantity) && x.quantity > 0){
        return res.status(400).send({status: false, message:"Please provide quantity min 1"})
      }     
})
if(!validator.valid(totalPrice)){
    return res.status(400).send({status: false, message:"Please provide totalprice"})
  }
  if(!validator.valid(totalItems)){
    return res.status(400).send({status: false, message:"Please provide totalItems"})
  }
  body.userId=userid;

 const createcart = await cartModel.create(body);
 return res.status(201).send({status: true, data:createcart})
    }
    catch(err){
        return res.status(500).send({status:false,message:err.message})
    }

} 
const updateCart = async function (req, res) {
    try {
        const userId = req.params.userId
        const {cartId, productId, removeProduct} = req.body
        
        if (Object.keys(userId) == 0) {return res.status(400).send({status: false, message: "Please provide user id in path params"})}

        if (!validator.isValidObjectId(userId)) {return res.status(400).send({status: false, message: "Please provide a valid User Id"})}

        if (!validator.isValid(cartId)) {return res.status(400).send({status: true, message: "Please provide cart id in body"})}

        if (!validator.isValidObjectId(cartId)) {return res.status(400).send({status: false, message: "Please provide a valid Cart Id"})}

        if (!validator.isValid(productId)) {return res.status(400).send({status: true, message: "Please provide cart id in body"})}

        if (!validator.isValidObjectId(productId)) {return res.status(400).send({status: false, message: "Please provide a valid Product Id"})}

        if (!validator.isValid(removeProduct)) {return res.status(400).send({status: true, message: "Please provide cart id in body"})}

        
        let cart = await cartModel.findById({ _id: cartId })
        if (!cart) {
            return res.status(404).send({ status: false, msg: "Cart not found" })
        }
        if (cart.totalPrice == 0 && cart.totalItems == 0) {
            return res.status(400).send({ status: false, msg: "Cart is empty" })
        }
        let user = await userModel.findOne({ _id: userId, isDeleted: false })
        if (!user) {
            return res.status(404).send({ status: false, msg: "User not found" })
        }
        let cartMatch = await cartModel.findOne({userId: userId})
        if (!cartMatch) {
            return res.status(401).send({status: false, message: "This cart doesnot belong to you. Please check the input"})
        }
        let product = await productModel.findOne({ _id: productId, isDeleted: false })
        if (!product) {
            return res.status(404).send({ status: false, msg: "Product not found" })
        }
        
        if (removeProduct == 0) {
            for (let i = 0; i < cart.items.length; i++) {
                if (cart.items[i].productId == productId) {
                    const productPrice = product.price * cart.items[i].quantity
                    const updatePrice = cart.totalPrice - productPrice
                     cart.items.splice(i, 1)
                    const updateItems = cart.totalItems - 1
                    const updateItemsAndPrice = await cartModel.findOneAndUpdate({ userId: userId }, { items: cart.items, totalPrice: updatePrice, totalItems: updateItems },{new:true})
                    return res.status(200).send({ status: true, msg: "Succesfully Updated in the cart", data: updateItemsAndPrice })
                }

            }
        } else if (removeProduct == 1){
            for (let i = 0; i < cart.items.length; i++) {
                if (cart.items[i].productId == productId) {
                    const updateQuantity = cart.items[i].quantity - 1
                    if (updateQuantity < 1) {
                        const updateItems = cart.totalItems - 1
                        const productPrice = product.price * cart.items[i].quantity
                        const updatePrice = cart.totalPrice - productPrice
                         cart.items.splice(i, 1)
                        
                        const updateItemsAndPrice = await cartModel.findOneAndUpdate({ userId: userId }, { items: cart.items, totalPrice: updatePrice, totalItems: updateItems },{new:true})
                        return res.status(200).send({ status: true, msg: "Product has been removed successfully from the cart", data: updateItemsAndPrice })

                    } else {
                        cart.items[i].quantity = updateQuantity
                        const updatedPrice = cart.totalPrice - (product.price * 1)
                        const updatedQuantityAndPrice = await cartModel.findOneAndUpdate({ userId: userId }, { items:cart.items,totalPrice: updatedPrice },{new:true})
                        return res.status(200).send({ status: true, msg: "Quantity has been updated successfully in the cart", data: updatedQuantityAndPrice })
                    }
                }
            }
        }

    } catch(error) {
        res.status(500).send({ status: false, msg: error.msg })
    }
}

module.exports={cartcreate,updateCart}