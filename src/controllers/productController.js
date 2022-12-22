const productModel = require('../Models/productsModels')
const validator = require('../validators/validator')
const aws =require('./aws')


/*-------------------------Product create ---------------------------------*/

const createProduct =async (req,res)=>{
     
    try{
   const data=req.body;
   let productImage = req.files
   const {title,description,price,availableSizes}  = data

   /*------------------------- validation ---------------------------------*/
   if(Object.keys(body).length==0 && productImage.length==0){
    return res.status(400).send({status:false,message:"Please provide body"})
 }
     if(!validator.valid(title)){
        return res.status(400).send({status:false,message:"Please provide title"})
     }
     const checktitle= await productModel.findOne({title:title})
     if(checktitle){
        return res.status(400).send({status:false,message:"Please provide unquie title"})
     }
     if(!validator.valid(description)){
        return res.status(400).send({status:false,message:"Please provide description"})
     }
     if(!validator.valid(price)){
        return res.status(400).send({status:false,message:"Please provide description"})
     }

     if(!["S", "XS","M","X", "L","XXL", "XL"].includes(availableSizes)){
        return res.status(400).send({status:false,message:"Please provide availableSizes type bleow" ,likethis:["S", "XS","M","X", "L","XXL", "XL"]})
     }
     
     if(!productImage){
        return res.status(400).send({status:false,message:"Please provide productImage"})
     }
     /*-------------------------create url ---------------------------------*/
     const uploadedFileURL = await aws.uploadFile(productImage[0])
     
     data.productImage=uploadedFileURL;

     /*-------------------------create product ---------------------------------*/

     const createProduct = await productModel.create(data)
     return res.status(201).send({status:true,data:createProduct})
    }
    catch(err){
        return res.status(500).send({status:false,message:err.message})
    }
     
}


/*-------------------------Product Update ---------------------------------*/


const updateproduct = async (req,res)=>{

    try{

    const productid=req.params.productId
    const body=req.body;
    let productImage = req.files
    const {title,description,price}  = body
    const data={}

   /*-------------------------productid validation ---------------------------------*/
    if(!productid){
        return res.status(400).send({status:false,message:"please provide productid"})
    }
    if(!validator.isValidObjectId(productid)){
        return res.status(400).send({status:false,message:"please provide correct productid"})
    }
    const checkproductid = await productModel.findById({_id:productid,isDeleted:false})

    if(!checkproductid){
        return res.status(400).send({status:false,message:"please provide register productid"})
    }
    
    /*-------------------------body validation ---------------------------------*/

        if(Object.keys(body).length==0 && productImage.length==0){
            return res.status(400).send({status:false,message:"Please provide body"})
         }

      if(title){
    if(!validator.valid(title)){
        return res.status(400).send({status:false,message:"Please provide title"})
     } data.title=title
    }

        if(description){
     if(!validator.valid(description)){
        return res.status(400).send({status:false,message:"Please provide description"})
     } data.description=description
    }
        if(price){
     if(!validator.valid(price)){
        return res.status(400).send({status:false,message:"Please provide description"})
     }data.price=price
    }
     if (body.currencyId){
        if (!(validator.valid(body.currencyId))) {
            return res.status(400).send({status: false, message: "Please provide Currency Id to update"})}
            if (body.currencyId.trim() !== "INR") {
                return res.status(400).send({ status: false, message: "Please provide Indian Currency Id" })
            }
            data.currencyId = body.currencyId
        }

        if (body.currencyFormat){
        if (!(validator.valid(body.currencyFormat))) {
            return res.status(400).send({status: false, message: "Please provide Currency Format to update"})}
            if (body.currencyFormat.trim() !== "₹") {
                return res.status(400).send({ status: false, message: "Please provide right format for currency" })
            }
            data.currencyFormat = body.currencyFormat
        }
         
        if (body.availableSizes){
            if (!(validator.valid(body.availableSizes))) {
                return res.status(400).send({status: false, message: "Please provide available size to update"})}
    
                if (!(validator.isValidAvailableSizes(body.availableSizes))) {
                    return res.status(400).send({ status: false, message: "Please provide a valid size" })
                }
                
                data.availableSizes = body.availableSizes
    
            }
    
            if (body.installments != null){
            if (!(validator.valid(body.installments))) {
                return res.status(400).send({ status: false, message: "Please provide installment to update" })
                }
                data.installments = body.installments
            }

     if(productImage.length > 0){
        const uploadedFileURL = await aws.uploadFile(productImage[0])
        data.productImage=uploadedFileURL;
     }
     const   updateproduct = await productModel.findOneAndUpdate({_id:productid},data,{new:true})
     return res.status(200).send({status:true,data:updateproduct})
    }
    catch(err){
        return res.status(500).send({status:false,message:err.message})
    }

}

//-----------------------------Get Product By Id --------------------------------//

 const getProductById = async function (req, res) {

   try {
        let productId = req.params.productId
        if (!validator.isValidObjectId(productId)) {
            return res.status(400).send({ status: false, message: "please enter valid productId" })
        }
        let product = await productModel.findOne({ _id: productId, isDeleted: false })

        if (!product) {
            return res.status(404).send({ status: false, message: "Product not found" })
        }
        res.status(200).send({ status: true, message: 'Success', data: product })
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }}

//--------------------- deleteProduct ----------------------------///


const deleteProduct = async function (req, res) {
    try {
        let productId = req.params.productId

        if (!validator.isValidObjectId(productId)) {
            return res.status(400).send({ status: false, message: "please enter valid productId" })
        }

        let product = await productModel.findById(productId)

        if (!product) {
            return res.status(404).send({ status: false, message: "Product not found" })
        }
        else {
            if (product.isDeleted == true)
                return res.status(404).send({ status: false, message: "Product Already deleted" })
        }
        await productModel.findByIdAndUpdate({_id:productId}, { $set: { isDeleted: true, deletedAt: new Date() } })
        res.status(200).send({ status: true, message: "Product Deleted Successfully" })
    }catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }}

//--------------------- Get Product by Query ----------------------------///

const getProductbyQuery = async function (req, res) {
    try {


        let { size, name, priceGreaterThan, priceLessThan, priceSort } = req.query
          

        let filters = { isDeleted: false }

        if (size != null) {
            if (!validator.isValidAvailableSizes(size)) {
                return res.status(400).send({ status: false, msg: 'No Such Size Exist in our Filters ... Select from ["S", "XS", "M", "X", "L", "XXL", "XL"]' })
            }
            filters["availableSizes"] = size
        }

    

        if (name != null) {
            if (!validator.valid(name)) return res.status(400).send({ status: false, message: "Please enter Product name" })
            filters['title'] = { $regex: `.${name.trim()}.` }
        }

        if (priceGreaterThan != null && priceLessThan == null) {
            filters["price"] = { $gt: priceGreaterThan }
        }


        if (priceGreaterThan == null && priceLessThan != null) {
            filters["price"] = { $lt: priceLessThan }
        }

        if (priceGreaterThan != null && priceLessThan != null) {
            if (priceGreaterThan > priceLessThan){return res.status(400).send({status: false, message:"Input error. Price greater than filter can not be less than price less than filter"})}
            filters["price"] = { $gte: priceGreaterThan, $lte: priceLessThan }
        }

        if (priceSort != null) {
            if (priceSort == 1) {
                const products = await productModel.find(filters).sort({ price: 1 })
                if (products.length == 0) {
                    return res.status(404).send({ status: false, message: "No data found that matches your search" })
                }
                return res.status(200).send({ status: true, message: "Results",count: products.length, data: products })
            }

            if (priceSort == -1) {
                const products = await productModel.find(filters).sort({ price: -1 })
                if (products.length == 0) {
                    return res.status(404).send({ status: false, message: "No data found that matches your search" })
                }
                return res.status(200).send({ status: true, message: "Results", count: products.length, data: products })
            }

        }

        const products = await productModel.find(filters)
        if (products.length == 0) {
            return res.status(404).send({ status: false, message: "No data found that matches your search" })
        }
        return res.status(200).send({ status: true, message: "Results",count: products.length, data: products })


    }
    catch (error) {
        console.log(error)
        return res.status(500).send({ status: false, message: error.message })
    }

}

module.exports={createProduct,updateproduct,deleteProduct,getProductById,getProductbyQuery}