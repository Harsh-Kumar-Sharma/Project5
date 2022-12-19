const mongoose = require("mongoose")

const valid = function (input){
if(typeof(input)=== undefined || typeof(input)===null){ return false}
if(typeof(input)==="string" && input.trim().length>0){ return true}
if(typeof(input)==="number" && input.toString().trim().length>0){ return true}
if(typeof(input)==="object" && input.length>0) {return true}
}

const validEmail = function (email){
    return /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email);
}

const validPhone = function (phone){
    return /^\+?([9]{1})\)?([1]{1})\)?([6-9]{1})\)?[-. ]?([0-9]{9})$/.test(phone);
}

const isValidObjectId = function (objectId){
    return mongoose.Types.ObjectId.isValid(objectId)
}
const validPincode = function(pincode){
    if ( /^\+?([1-9]{1})\)?([0-9]{5})$/.test(pincode)) return true
}


module.export={valid,validEmail,validPhone,isValidObjectId,validPincode}