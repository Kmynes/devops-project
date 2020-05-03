import { Schema } from 'mongoose';

export const SubjectSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    teachers:[Schema.Types.ObjectId]
});