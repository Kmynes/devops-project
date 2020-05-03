import * as mongoose from 'mongoose';

export const CourseSchema = new mongoose.Schema({
    subject:{
        type:String,
        required:true
    },
    class_name:{
        type:String,
        reaquired: true
    },
    teacher:{
        type:String,
        reaquired: true
    },
    date:Date
});