import { Document } from 'mongoose';

export interface Course extends Document {
    name:String
    class_name:String
}