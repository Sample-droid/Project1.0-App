var mongoose=require("mongoose")
// var userSchema=mongoose.Schema({
//     username:String,
//     password:String,
//     role:{type:String,enum:["admin","user"],default:"user"}
// })

// module.exports=userModel;
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "user"], default: "user" }
}, { timestamps: true });
var userModel=mongoose.model("user",userSchema)
module.exports=userModel;
// Model/Login.js


const loginSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

module.exports = mongoose.model('Login', loginSchema);