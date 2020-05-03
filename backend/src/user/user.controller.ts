import { 
  Controller, 
  Get, 
  UseGuards, 
  Patch,
  Body
} from '@nestjs/common';
import { 
    ApiUseTags,
    ApiBearerAuth 
} from '@nestjs/swagger';

import { GetUser } from './get-user.decorator';
import { User } from './interfaces/user.interface';
import { UserService } from './user.service';
import { AuthGuard }   from '@nestjs/passport';
import { AddCoursDTO } from './dto/addcours.dto';

@ApiUseTags('user')
@ApiBearerAuth()
@Controller('user')
@UseGuards(AuthGuard())
export class UserController {
  constructor(private readonly userService:UserService) {}

  private coursMapper({_id, subject, teacher, date} :any) {     
    return {
      _id,
      subject,
      teacher,
      date
    }
  }

  @Get("infos")
  async getInfos(@GetUser() user:User) {
    const courses = await this.userService.getCourses();

    const otherCourses = courses.filter(
      course => course.class_name !== user.class_name
    ).map(this.coursMapper);

    const userCourses = courses.filter(
      course => course.class_name === user.class_name
    ).map(this.coursMapper);

    return {
      email:user.email,
      firstname:user.firstname,
      lastname:user.lastname,
      status:user.status,
      userCourses,
      otherCourses
    };
  }

  @Patch("addCours")
  async addCours(@GetUser() user:User, @Body() addCours:AddCoursDTO) {
    await this.userService.setCoursToUser(addCours.cours_id, user.class_name);
    return {
      code:200,
      data:"ok"
    };
  }

  @Patch("removeCours")
  async removeCours(@Body() addCours:AddCoursDTO) {
    await this.userService.setCoursToUser(addCours.cours_id, "");
  }
}