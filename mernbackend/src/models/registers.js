const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email: {
        type:String,
        required:true,
        unique:true

    },
    password:{
       type:String,
        required:true
    }
})

//now we need to create a collections

const Register = new mongoose.model("Register", customerSchema);

module.exports = Register;

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