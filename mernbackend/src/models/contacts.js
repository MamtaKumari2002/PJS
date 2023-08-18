const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email: {
        type:String,
        required:true,
        unique:true

    },
    massage:{
       type:String,
        required:true
    },
    // this is for thank you mesaage---
    submitted: {
        type: Boolean,
        default: false
    },
    thankYouMessage: {
        type: String,
        defualt: ""
    }
});

//now we need to create a collections

const Contact = new mongoose.model("Contact", contactSchema);

module.exports = Contact;

// // ---------------login form schema-----
// const loginSchema = new mongoose.Schema({
//     username:{
//         type:String,
//         required:true
//     },
//     password:{
//         type:String,
//         required:true
//     }

// });
// // const Login = new mongoose.model("Login", loginSchema);
// const Login = new mongoose.model("Login", loginSchema);
// module.exports = Login;