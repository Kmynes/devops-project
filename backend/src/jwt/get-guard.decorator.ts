import { createParamDecorator } from "@nestjs/common";
import { User } from "../user/interfaces/user.interface";

export interface Guard {
    token:string 
    user:User
}

export const GetGuard = createParamDecorator((_, req):Guard => {
    return req.user;
});