import { Logger} from "@nestjs/common";
import {
  connect, 
  Model, 
  Document
} from 'mongoose';
import * as redis from "redis";
import * as faker from 'faker';
import { UserSchema } from '../user/schemas/user.schemas';
import { CourseSchema } from '../user/schemas/course.schema';
import { ClassSchema } from '../user/schemas/class.schema';
import { SubjectSchema } from '../user/schemas/subject.schema';

const logger = new Logger("DatabaseProviders");

const classes = [
  "6A",
  "6B",
  "6C",
  "6D",
  "6E", 
  "5A",
  "5B",
  "5C",
  "5D",
  "5E",
  "4A",
  "4B",
  "4C",
  "4D",
  "4E",
  "3A",
  "3B",
  "3C",
  "3D",
  "3E"
];

const subjects = [
  "Math",
  "Algo",
  "Physique",
  "Français",
  "Anglais",
  "Histoire-Géo",
  "EPS",
  "Espagnol",
  "SVT"
];

function buildUsers(userModel:Model<Document>, nbrUsers:number, status:string) {
  const users = [];
  const classe_names = "student" === status ? [...classes] : [...subjects];
  for (let i = 0; i < nbrUsers; i++) {
    const firstName = faker.name.firstName();
    const lastName  = faker.name.lastName();
    const email     = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@school.fr`;
    const password  = faker.internet.password(8);
    const student   = {
      firstName,
      lastName,
      email,
      password,
      status,
      class_name:classe_names[0]
    };

    if (status === "student") {
      if (i !== 0 && i % 20 === 0)
        classe_names.splice(0, 1);
    }
    else if (status === "teacher") {
      if (i !== 0 && i % 7 === 0)
        classe_names.splice(0, 1);
    }

    users.push(student);
  }
  return userModel.insertMany(users);
}

function wait(second:number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 1000 * second);
  });
}

function addDays(date, days) {
  var newDate = new Date(date.valueOf());
  newDate.setDate(newDate.getDate() + days);
  return newDate;
}

function randomDate(start, end, startHour, endHour) {
  var date = new Date(+start + Math.random() * (end - start));
  var hour = startHour + Math.random() * (endHour - startHour) | 0;
  date.setHours(hour);
  date.setMinutes(0, 0, 0);
  return date;
}

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async (): Promise<typeof import('mongoose')> => {
      try {
        const options = {
          useFindAndModify:false,
          useUnifiedTopology: true, 
          useNewUrlParser: true, 
          useCreateIndex: true 
        };
        const { mongo_connection } = process.env;
        logger.log(mongo_connection);
        let connection = await connect(mongo_connection, options);
        logger.log("Mongodb connection done");
        const coursModel   = connection.model("cours", CourseSchema);
        const classModel   = connection.model("class", ClassSchema);
        const userModel    = connection.model("user", UserSchema);
        const subjectModel = connection.model("subject", SubjectSchema);

        await subjectModel.deleteMany({});
        await userModel.deleteMany({
          status:{ $in:['student', 'admin', 'teacher'] }
        });
        await coursModel.deleteMany({});
        await classModel.deleteMany({});

        logger.log("Begin of database building");
        const nbrStudent = classes.length * 20;
        //Build and intsert classes
        await classModel.insertMany(classes.map(name => ({ name }) ));

        //Build and intsert students
        await buildUsers(userModel, nbrStudent, 'student');

        //Build and insert subjects
        await subjectModel.insertMany(subjects.map(name => ({ name, teachers:[] }) ));
        await buildUsers(userModel, 40, 'teacher');

        //Map teacher to subjectes
        const teachersName = (await userModel.find({
          status:'teacher'
        })).map(({firstName, lastName}:any) => `${firstName} ${lastName}`);

        const courses = [];
        const subjectsName = (await subjectModel.find()).map((s:any) => s.name);
        const classesName = (await classModel.find()).map((c:any) => c.name);
        for (let i = 0; i < 100; i++) {
          const randIndexSubject = faker.random.number(subjectsName.length - 1);
          const randIndexClass = faker.random.number(classesName.length - 1);
          const randIndexTeacher = faker.random.number(teachersName.length - 1);
          const cours = {
            subject:subjectsName[randIndexSubject],
            class_name:classesName[randIndexClass],
            teacher:teachersName[randIndexTeacher],
            date:randomDate(addDays(new Date(), 1), addDays(new Date(), 5), 8, 18)
          };
          courses.push(cours);
        }
        logger.log("Database builded");
        await coursModel.insertMany(courses);
        logger.log("Database inserted");
        logger.log("Close database connection");
        await connection.disconnect();

        logger.log("Sleep 1s");
        await wait(1);
        
        connection = await connect(mongo_connection, options);
        logger.log("Databse connection reopen");

        return connection; 
      } catch(e) {
        logger.error(JSON.stringify(e));
        process.exit(1);
      }
    }
  },
  {
    provide: 'REDIS_CONNECTION',
    useFactory: async ():Promise<redis.RedisClient> => {
      try {
        const { redis_connection } = process.env;
        logger.log("Create redis connection");
        const redisClient = redis.createClient(redis_connection);
        logger.log("Redis connection done");
        return redisClient;
      } catch(e) {
        logger.error(JSON.stringify(e));
        process.exit(1);
      }
    }
  }
];