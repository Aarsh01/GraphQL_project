const mongoose=require('mongoose');
const Mschema=mongoose.Schema;
//mongoose.set("useFindAndModify",false);

const userSchema= new Mschema({
    name:String,
    age:Number,
    professional:String,
});
module.exports=mongoose.model("User",userSchema)