import { IsString } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class IsLoggedDto {
    @ApiModelProperty()
    @IsString()
    token:string
}