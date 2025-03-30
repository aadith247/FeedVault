import mongoose, {Schema,model,connect} from 'mongoose'
import { unescapeLeadingUnderscores } from 'typescript';

connect('mongodb+srv://Aadithhya:Venkat%40123@cluster0.7lvh3qz.mongodb.net/Brain');

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