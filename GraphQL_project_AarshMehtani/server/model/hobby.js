const mongoose=require('mongoose');
const Mschema=mongoose.Schema;
//mongoose.set("useFindAndModify",false);

const hobbySchema=new  Mschema({
    title:String,
    description:String,
    userId:String,
});
module.exports=mongoose.model("Hobby",hobbySchema)