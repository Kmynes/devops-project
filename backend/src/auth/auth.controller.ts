import { 
    Controller, 
    Post,
    Body,
    UseGuards, 
    Logger, 
    ForbiddenException
} from '@nestjs/common';
import { ApiUseTags, ApiBearerAuth } from "@nestjs/swagger";
import { AuthGuard } from '@nestjs/passport';
import { GetGuard, Guard } from '../jwt/get-guard.decorator';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { IsLoggedDto } from './dto/isLoged.dto';

@ApiUseTags('auth')
@Controller('auth')
export class AuthController {

    private logger:Logger;
    constructor(private readonly authService: AuthService) {
        this.logger = new Logger("AuthController");
    }

    @Post("register")
    async register(@Body() userDto: CreateUserDto) {
        if (userDto.password !== userDto.checkPassword)
            throw new ForbiddenException("Passwords must be the same");

        const token = await this.authService.register(userDto);
        return {
            code:200,
            data:token
        };
    }

    @Post("login")
    async login(@Body() authDto: LoginDto) {
        const token = await this.authService.login(authDto);
        return {
            code:200,
            data:token
        };
    }

    @Post("isLogged")
    @ApiBearerAuth()
    @UseGuards(AuthGuard())
    async isLogged(@GetGuard() guard:Guard):Promise<boolean> {
        const { token } = guard;
        return this.authService.checkToken(token);
    }

    @Post("logout")
    @ApiBearerAuth()
    @UseGuards(AuthGuard())
    logout(@GetGuard() guard:Guard) {
        const { token, user } = guard;
        this.logger.log(`Request logout \nemail:${user.email}`);
        this.authService.logout(token);
        return {
            code:200,
            data:"Logout with success"
        };
    }

    @Post("refresh")
    @ApiBearerAuth()
    @UseGuards(AuthGuard())
    async refresh(@GetGuard() guard:Guard) {
        const { token, user } = guard;
        this.logger.log(`Request refresh \nemail:${user.email}`);
        return {
            code:200,
            data:await this.authService.refresh(token, user)
        };
    }
}