const express = require("express");
const path = require("path");
const app = express();
const hbs = require("hbs");
require("./db/conn");

const Register = require("./models/registers");//Import the Register model
const Login = require("./models/login"); //Import the Login model
//For contact page
const Contact = require("./models/contacts");

//for logout
const session  = require("express-session");

const cors = require('cors');
//..




const port = process.env.PORT || 3000;

const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

// //doing by myself
const image_path = path.join(__dirname,"../templates/views/images");

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(express.static(static_path));
//Serve static files from the "images" directry
app.use('/images', express.static(__dirname + '/templates/views/images'));

// ----for logout
app.use(
    session({
        secret: "your-secret-key",
        resave:true,
        saveUninitialized: true,
    })
);

app.use(cors());

app.set("view engine", "hbs");
app.set("views", template_path);
// //myself
app.set("images", image_path);
hbs.registerPartials(partials_path);


//Middleware to check authentication status
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isAuthenticated || false;
    next();
});



app.get("/", (req, res) => {
    res.render("index")
});

app.get("/account", (req, res) =>{
    res.render("account", {isAuthenticated: req.session.isAuthenticated});
});

app.get("/login", (req, res) => {
    res.render("login", { isAuthenticated: req.setEncoding.isAuthenticated});
})

//--------for contact page------
app.get("/contact", (req, res) => {
    res.render("contact");
});

//------for about page----
app.get("/about", (req, res) => {
    res.render("about")
})


const bcrypt = require('bcrypt');
//create a new user in our database
app.post("/register", async(req, res) => {
    try {

        // console.log(req.body.username);
        // res.send(req.body.username);
        const { username, email, password } = req.body;

        //Hash the pasword
        const hashedPassword = await bcrypt.hash(password,10); // 10 is the salt rounds
        const registerCustomer = new Register({
            username:username,
            email:email,
            password:hashedPassword,//Store the hashed password
        });

        // const registerCustomer = new Register({
        //     username : req.body.username,
        //     email : req.body.email,
        //     password : req.body.password
        // })
       const registered =  await registerCustomer.save();
       res.status(201).render("index");

    }catch(error){
        res.status(400).send(error);
    }
});


//-----------------contact page-----
// app.post("/contact", async(req, res) => {
//     try {

//         // console.log(req.body.username);
//         // res.send(req.body.username);
//         const { name, email, massage } = req.body;

//         //Hash the pasword
//         //const hashedPassword = await bcrypt.hash(password,10); // 10 is the salt rounds
//         const contactCustomer = new Contact({
//             name:name,
//             email:email,
//             massage:massage,//Store the hashed password
//         });

//         // const registerCustomer = new Register({
//         //     username : req.body.username,
//         //     email : req.body.email,
//         //     password : req.body.password
//         // })
//        const contacted =  await contactCustomer.save();
//     // await contactCustomer.save();
//        res.status(201).render("index");

//     }catch(error){
//         res.status(400).send(error);
//     }
// });

//-----with thankyou feature------
app.post("/contact", async(req, res) => {
    try {

        // console.log(req.body.username);
        // res.send(req.body.username);
        const { name, email,phone, address, massage } = req.body;

        //Hash the pasword
        //const hashedPassword = await bcrypt.hash(password,10); // 10 is the salt rounds
        const contactCustomer = new Contact({
            name:name,
            email:email,
            phone:phone,
            address:address,
            massage:massage,//Store the hashed password
        });

        // const registerCustomer = new Register({
        //     username : req.body.username,
        //     email : req.body.email,
        //     password : req.body.password
        // })
    //    const contacted =  await contactCustomer.save();
    await contactCustomer.save();

    //Update the submitted flag and thankYouMessage
    contactCustomer.submitted = true;
    contactCustomer.thankYouMessage = "Thank you for contacting us!";

    res.render("contact", { contact: contactCustomer}); //Render the contact page with updated data
    } catch(error) {
        res.status(400).send(error);
    }
    //    res.status(201).render("index");

    // }catch(error){
    //     res.status(400).send(error);
    // }
});



app.get("/product", (req, res) => {
    res.render("product");
});
app.get("/product-details", (req, res) =>{
    res.render("product-details");
});
app.get("/cart", (req, res) => {
    res.render("cart");
});


// //----my contact-page is-----
// app.get("/contact", (req, res) => {
//     res.render("contact");
// });

// ----------login part-------
app.post("/login", async(req, res) => {
    try{
        const username = req.body.username;
        const password = req.body.password;

        const user = await Register.findOne({username:username});

        if(user) {
            //Compare hashed password
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if(isPasswordValid){
                // res.status(201).render("index");
                //for logout
                //Set authentication status in session
                req.session.isAuthenticated = true;
                res.redirect("/account");
            } else{
                res.send("Invalid login details");
            }
        } else {
            res.send("user not found");
        }

        // //Set authentication status in session
       
        // //Redirect to account page after successful login
        // res.redirect("/account");

    } catch (error) {
        res.status(400).send("Invalid login details");
    }

    //     if(user && user.password === password){
    //         res.status(201).render("index");
    //     } else{
    //         res.send("Invalid login details");
    //     }
    // } catch(error){
    //     res.status(400).send("Invalid login details");
    // }

    //   const matchusername = await Register.findOne({username:username});
    //   console.log(username);
    //     if(matchusername.password === password){
    //         res.status(201).render("index");
    //     }
    //     else{
    //         res.send("invalid login details");
    //     }
        // console.log(`${username} and password is ${password}`);
        

    // }catch(error){
    //     res.status(400).send("invalid login details");
    // }
});

//---logout code---
app.post("/logout", (req, res) => {
    //Clear authentication status in session
    req.session.isAuthenticated = false;
    res.redirect("/account");
});

// // Handle logout
// app.get("/logout", (req, res) => {
//     //Clear authentication status in session
//     req.session.isAuthenticated = false;
//     //Redirect to account page after logout
//     res.redirect("/account");
// });





app.listen(port, () => {
    console.log(`server is running at port no ${port}`);
});
// Create a Mongoose model for user registration
// const User = mongoose.model("User", {
//     username: String,
//     email: String,
//     password: String,
//   });
  
//   // Parse JSON data from the request body
//   app.use(express.json());
  
//   // POST route for handling user registration
//   app.post("/register", (req, res) => {
//     const { username, email, password } = req.body;
  
//     // Create a new user instance
//     const newUser = new User({
//       username,
//       email,
//       password,
//     });
  
//     // Save the user data to the database
//     newUser
//       .save()
//       .then(() => {
//         res.status(201).send("User registered successfully");
//       })
//       .catch((error) => {
//         res.status(500).send("Registration failed");
//       });
//   });
  
//   app.listen(port, () => {
//     console.log(`Server is running at port ${port}`);
//   });

// const express = require("express");
// const app = express();
// const mongoose = require("mongoose");
// require("./db/conn");

// const port = process.env.PORT || 3000;

// const User = mongoose.model("User", {
//   username: String,
//   email: String,
//   password: String,
// });

// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));


// // app.get("/", (req, res) => {
// //   res.send("Hello from PJS");
// // });
// app.get("/register", (req, res) => {
//   res.send("Register Page");
// });
// app.post("/register", (req, res) => {
//   const { username, email, password } = req.body;

//   // Create a new user instance
//   const newUser = new User({
//     username,
//     email,
//     password,
//   });

//   // Save the user data to the database
//   newUser
//     .save()
//     .then(() => {
//       res.status(201).send("User registered successfully");
//     })
//     .catch((error) => {
//       res.status(500).send("Registration failed");
//     });
// });

// app.listen(port, () => {
//   console.log(`Server is running at port ${port}`);
// });
