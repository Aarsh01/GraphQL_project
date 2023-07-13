const mongoose=require('mongoose');
const Mschema=mongoose.Schema;
//mongoose.set("useFindAndModify",false);

const postSchema= new Mschema({
    comment:String,
    userId:String,
});
module.exports=mongoose.model("Post",postSchema)