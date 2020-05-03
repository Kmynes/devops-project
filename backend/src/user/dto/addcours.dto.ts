import {IsString} from "class-validator";

export class AddCoursDTO {
    @IsString()
    cours_id:string    
}