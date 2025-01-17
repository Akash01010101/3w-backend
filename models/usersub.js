const mongoose = require('mongoose');  

const userSubSchema = new mongoose.Schema({  
    name: { type: String, required: true },  
    socialmedia: { type: String, required: true },  
    
    images: { type: [String], required: true }, 
}, { timestamps: true });  

module.exports = mongoose.model('UserSub', userSubSchema);