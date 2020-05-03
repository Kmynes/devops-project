import { IsString, IsEmail } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiModelProperty()
    @IsString()
    firstName:string;

    @ApiModelProperty()
    @IsString()
    lastName: string;

    @ApiModelProperty()
    @IsString()
    @IsEmail()
    email: string;

    @ApiModelProperty()
    @IsString()
    password:string;

    @ApiModelProperty()
    @IsString()
    checkPassword:string;
}