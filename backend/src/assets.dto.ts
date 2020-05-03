import { IsString } from "class-validator";

export class AssetsDTO {
    @IsString()
    name:string
}