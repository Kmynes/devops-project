import { IsString, IsEmail } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiModelProperty()
  @IsString()
  @IsEmail()
  email:string;

  @ApiModelProperty()
  @IsString()
  password:string;
}