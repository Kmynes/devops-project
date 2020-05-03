import {
    Injectable,
    Inject,
    Logger
} from '@nestjs/common';
import { Model, connect } from 'mongoose';
import { Course } from './interfaces/course.interface';
import { User } from './interfaces/user.interface';
import { CourseSchema } from '../user/schemas/course.schema';

interface CreateUser {
    firstName:string; 
    lastName: string;
    email: string;
    password:string;
    status:string
}

@Injectable()
export class UserService {
    private _types:string;
    private logger:Logger
    get types() {
        return this._types;
    }
    constructor(
        @Inject("USER_MODEL") private readonly userModel:Model<User>,
        @Inject("COURSE_MODEL") private readonly courseModel:Model<Course>) {
            this.logger = new Logger("UserService", true);
        }

    async getCourses():Promise<Course[]> {
        this.logger.log("Get courses");
        const courses = await this.courseModel.find().exec();
        if (!courses)
          return [];

        return courses;
    }

    async setCoursToUser(cours_id:string, class_name:string) {
        await this.courseModel.updateOne({_id:cours_id}, {
            class_name
        });
    }

    async create(createUser:CreateUser):Promise<User> {
        return await this.userModel.create({ ...createUser, class_name:'student-extern' });
    }

    async findOne(predicat):Promise<User> {
        return await this.userModel.findOne(predicat);
    }

    async findByEmail(email:string) {
        return await this.userModel.findOne({email});
    }

    async findAll(): Promise<User[]> {
        return await this.userModel.find().exec();
    }
}