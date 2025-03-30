import mongoose, {Schema,model,connect} from 'mongoose'
import { unescapeLeadingUnderscores } from 'typescript';

connect('mongo_url');

const userSchema=new Schema({
    username:String,
    password:String

});



export let userModel=model("Users",userSchema);

const contentSchema=new Schema({
    title:String,
    type:String,
    link:String,
    tags:[{type:mongoose.Types.ObjectId,ref:"Tags"}],
    userId:{type:mongoose.Types.ObjectId,ref:'Users',required:true}

})


const linkSchema=new Schema({
    userId:{type:mongoose.Types.ObjectId,ref:"Users"},
    link:String
})

export const linkModel=model("Links",linkSchema);


export const contentModel=model("Contents",contentSchema);
