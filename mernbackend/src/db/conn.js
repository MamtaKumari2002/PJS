const mongoose = require("mongoose");

// mongoose.connect("mongodb://localhost:27017/PJSRegistration", {
//     useNewUrlParser:true,
//     useUnifiedTopology:true,
//    // useCreateIndex:true
// });

// -----------login-------

mongoose.connect("mongodb://localhost:27017/customerRegistration", {
    useNewUrlParser:true,
    useUnifiedTopology:true,
   // useCreateIndex:true
});
//.then(() => {
//     console.log(`connection successful`);
// }).catch((e) => {
//     console.log(`no connection`);
// })

const db = mongoose.connection;

db.on("error", (error) => {
  console.error("MongoDB connection error:", error);
});

db.once("open", () => {
  console.log("MongoDB connection successful");
});

module.exports = db; // Export the connected database object